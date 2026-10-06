# Aura Deployment Strategy & Cloud Run Architecture

- **Container Environment**: Node.js CJS bundled server + static dist SPA fallback.
- **Port Routing**: Single ingress port 3000 behind reverse proxy.
- **Zero-Downtime Deployment**: Health check probe endpoints at `/api/health`.
