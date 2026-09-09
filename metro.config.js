const http = require('http');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Physical devices already reach Metro (USB adb reverse or Wi-Fi :8081).
 * Windows Firewall often blocks the backend on :8080, so /api is proxied
 * through Metro to 127.0.0.1:8080. The app then uses the Metro origin as
 * API_BASE_URL in __DEV__ (see src/config/runtimeConfig.ts).
 */
const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = Number(process.env.LUNARA_DEV_API_PORT || 8080);

function isApiRequest(req) {
  const url = req.url || '';
  return url === '/api' || url.startsWith('/api/');
}

function proxyApiToBackend(req, res) {
  const headers = { ...req.headers, host: `${BACKEND_HOST}:${BACKEND_PORT}` };
  delete headers.connection;
  delete headers['keep-alive'];
  delete headers['transfer-encoding'];
  delete headers.upgrade;

  const proxyReq = http.request(
    {
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: req.url,
      method: req.method,
      headers,
    },
    proxyRes => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.setTimeout(120000, () => {
    proxyReq.destroy(new Error('API proxy timed out'));
  });

  proxyReq.on('error', err => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(
      JSON.stringify({
        message:
          'Local API proxy failed. Is lunara-backend-new running on port 8080?',
        error: err.message,
      }),
    );
  });

  req.pipe(proxyReq);
}

/**
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    enhanceMiddleware: middleware => {
      console.log(
        `[metro] Proxying /api → http://${BACKEND_HOST}:${BACKEND_PORT} (wired + wireless device support)`,
      );
      return (req, res, next) => {
        if (isApiRequest(req)) {
          proxyApiToBackend(req, res);
          return;
        }
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
