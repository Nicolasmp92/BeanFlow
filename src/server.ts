import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Proxy /api/* → backend Spring Boot (BEANFLOW_API_URL, default http://localhost:8081).
 * En desarrollo el proxy lo aplica el dev-server de Angular vía proxy.conf.cjs;
 * esto es el equivalente para el servidor SSR de producción.
 */
const apiUrl = process.env['BEANFLOW_API_URL'] || 'http://localhost:8081';

app.use(
  '/api',
  createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
    // Express consume el prefijo /api al montar el middleware; este rewrite
    // lo repone si falta (mismo patrón que proxy.conf.cjs del dev-server).
    pathRewrite: (path: string) => (path.startsWith('/api') ? path : `/api${path}`),
  }),
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4001.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4001;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
