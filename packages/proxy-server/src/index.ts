import { createServer } from 'http';
import { createProxyServer } from 'http-proxy';

const proxy = createProxyServer({ changeOrigin: true });

const nHostUrls = {
  wsGraphql: 'wss://local.hasura.nhost.run',
  graphql: 'https://local.graphql.nhost.run',
  auth: 'https://local.auth.nhost.run',
  storage: 'https://local.storage.nhost.run',
  functions: 'http://127.0.0.1:3000',
  mailhog: 'https://local.mailhog.nhost.run',
  // Access to dashboards
  hasura: 'https://local.hasura.nhost.run',
  dashboard: 'https://local.dashboard.nhost.run',
};

// Http proxy
const server = createServer((req, res) => {
  const nhostService = req.url?.split('/')[2];

  if (!nhostService) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  req.url = req.url?.replace(`/${nhostService}`, '') || '';

  const target = nHostUrls[nhostService as keyof typeof nHostUrls];

  proxy.web(req, res, { target });
});

// Websocket proxy
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target: nHostUrls.wsGraphql });
});

server.listen(5050);
console.log('listening on port 5050');
