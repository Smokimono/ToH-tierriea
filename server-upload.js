// Serveur minimal d'upload local sans dépendance externe (utilise seulement Node core)
// Démarrage: node server-upload.js
// Fournit POST /api/heroes/:id/photo avec multipart très basique (limité)
// Pour une vraie robustesse, installer multer/express.

const http = require('http');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

function parseMultipart(req, boundary) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('binary');
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      const parts = data.split('--' + boundary).filter(p => p && p !== '--\r\n');
      for (const part of parts) {
        if (part.includes('Content-Disposition')) {
          const nameMatch = part.match(/name="([^"]+)"/);
          const filenameMatch = part.match(/filename="([^"]+)"/);
          if (filenameMatch) {
            const fileData = part.split('\r\n\r\n')[1];
            const cleaned = fileData.substring(0, fileData.length - 2); // remove trailing \r\n
            return resolve({ filename: filenameMatch[1], content: cleaned });
          }
        }
      }
      reject(new Error('No file part'));
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS simple
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const parsed = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsed.pathname;

  if (pathname.startsWith('/api/heroes/') && pathname.endsWith('/photo') && req.method === 'POST') {
    const heroId = req.url.split('/')[3];
    const ct = req.headers['content-type'] || '';
    const boundaryMatch = ct.match(/boundary=(.*)$/);
    if (!boundaryMatch) { res.writeHead(400); return res.end('Missing boundary'); }
    try {
      const file = await parseMultipart(req, boundaryMatch[1]);
      const safeName = Date.now() + '-' + file.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const heroDir = path.join(uploadDir, 'heroes', heroId);
      fs.mkdirSync(heroDir, { recursive: true });
      const filePath = path.join(heroDir, safeName);
      fs.writeFileSync(filePath, file.content, 'binary');
      const base = `http://${req.headers.host}`;
      const photoURL = `${base}/uploads/heroes/${heroId}/${safeName}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ photoURL }));
    } catch (e) {
      res.writeHead(500); return res.end('Upload error');
    }
  } else if (pathname.startsWith('/uploads/')) {
    const filePath = path.join(uploadDir, req.url.replace('/uploads/', ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      fs.createReadStream(filePath).pipe(res);
    } else { res.writeHead(404); res.end('Not found'); }
  } else if (pathname.startsWith('/api/heroes/') && pathname.endsWith('/photo') && req.method === 'DELETE') {
    const heroId = pathname.split('/')[3];
    const urlParam = parsed.searchParams.get('url') || '';
    try {
      const fileUrl = new URL(urlParam);
      const expectedPrefix = `/uploads/heroes/${heroId}/`;
      if (!fileUrl.pathname.startsWith(expectedPrefix)) { res.writeHead(400); return res.end('Bad url'); }
      const relative = fileUrl.pathname.replace('/uploads/', '');
      const baseDir = path.join(uploadDir);
      const filePath = path.join(baseDir, relative);
      if (!filePath.startsWith(baseDir)) { res.writeHead(400); return res.end('Bad path'); }
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.writeHead(204); return res.end();
    } catch (e) {
      res.writeHead(400); return res.end('Invalid url');
    }
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(3001, () => console.log('Upload server running on http://localhost:3001'));
