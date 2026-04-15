// WebSocket/SSE support for real-time features
// Used by: Auction bidding, Negotiation messages, Live event chat

export interface SSEClient {
  id: string;
  userId: string;
  channel: string;
  controller: ReadableStreamDefaultController;
}

const clients = new Map<string, SSEClient[]>();

export function addClient(channel: string, client: SSEClient) {
  const existing = clients.get(channel) || [];
  existing.push(client);
  clients.set(channel, existing);
}

export function removeClient(channel: string, clientId: string) {
  const existing = clients.get(channel) || [];
  clients.set(channel, existing.filter((c) => c.id !== clientId));
}

export function broadcast(channel: string, event: string, data: any) {
  const channelClients = clients.get(channel) || [];
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const encoder = new TextEncoder();
  for (const client of channelClients) {
    try {
      client.controller.enqueue(encoder.encode(message));
    } catch {
      removeClient(channel, client.id);
    }
  }
}

export function createSSEStream(channel: string, userId: string): ReadableStream {
  const clientId = `${userId}_${Date.now()}`;
  return new ReadableStream({
    start(controller) {
      addClient(channel, { id: clientId, userId, channel, controller });
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ clientId })}\n\n`));
    },
    cancel() {
      removeClient(channel, clientId);
    },
  });
}
