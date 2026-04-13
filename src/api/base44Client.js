import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

let clientInstance = null;

const getBase44Client = () => {
  if (!clientInstance) {
    const { appId, token, functionsVersion, appBaseUrl } = appParams;
    clientInstance = createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl
    });
  }
  return clientInstance;
};

// ── Global rate-limit queue ──────────────────────────────────────────
const MAX_CONCURRENT = 3;
const MIN_GAP_MS = 250;
const MAX_RETRIES = 3;
let _active = 0;
const _queue = [];

function _drain() {
  while (_active < MAX_CONCURRENT && _queue.length > 0) {
    const { fn, resolve, reject } = _queue.shift();
    _active++;
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        _active--;
        setTimeout(_drain, MIN_GAP_MS);
      });
  }
}

function _enqueue(fn) {
  return new Promise((resolve, reject) => {
    const wrapped = async () => {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          return await fn();
        } catch (err) {
          const is429 =
            err?.response?.status === 429 ||
            err?.status === 429 ||
            err?.message?.includes('Rate limit');
          if (is429 && attempt < MAX_RETRIES - 1) {
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
            continue;
          }
          throw err;
        }
      }
    };
    _queue.push({ fn: wrapped, resolve, reject });
    _drain();
  });
}

// Wrap every entity method (list, filter, create, update, delete, etc.) through the queue
function wrapEntityMethods(entityProxy) {
  return new Proxy(entityProxy, {
    get(target, method) {
      const val = target[method];
      if (typeof val === 'function') {
        return (...args) => _enqueue(() => val.apply(target, args));
      }
      return val;
    }
  });
}

// Proxy over the entities namespace so every Entity.method() goes through the queue
function wrapEntities(entitiesObj) {
  return new Proxy(entitiesObj, {
    get(target, entityName) {
      const entity = target[entityName];
      if (entity && typeof entity === 'object') {
        return wrapEntityMethods(entity);
      }
      return entity;
    }
  });
}

// Lazy-load client export — entity calls are rate-limited automatically
export const base44 = new Proxy({}, {
  get(target, prop) {
    const client = getBase44Client();
    if (prop === 'entities') {
      return wrapEntities(client.entities);
    }
    return client[prop];
  }
});