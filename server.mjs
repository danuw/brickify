import { createServer } from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 8080);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function safeResolve(requestPath) {
  const normalized = path.normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '');
  return path.join(distDir, normalized);
}

async function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const data = await readFile(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
}

createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  const requestUrl = new URL(req.url, 'http://localhost');

  if (requestUrl.pathname === '/health') {
    const payload = JSON.stringify({ status: 'ok' });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(payload);
    }
    return;
  }

  let filePath = safeResolve(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);

  try {
    await serveFile(filePath, res);
  } catch {
    // SPA fallback for deep links.
    try {
      filePath = path.join(distDir, 'index.html');
      await serveFile(filePath, res);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
    }
  }
}).listen(port, () => {
  console.log(`Brickify server listening on port ${port}`);
});
