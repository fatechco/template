import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { registerServiceWorker } from '@/lib/pwa-register'

registerServiceWorker()

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(<App />)
}