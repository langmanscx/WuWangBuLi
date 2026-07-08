const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const IMAGE_DIR = path.join(__dirname, 'imgs');

const server = http.createServer((req, res) => {
  // Parse the request URL to get the image path
  let imagePath = req.url;

  // Remove leading slash
  if (imagePath.startsWith('/')) {
    imagePath = imagePath.substring(1);
  }

  // Join with the image directory
  const fullPath = path.join(IMAGE_DIR, imagePath);

  // Ensure the resolved path stays within IMAGE_DIR to prevent directory traversal
  if (!fullPath.startsWith(IMAGE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if the path exists and is a file
  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    // Read the file
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
        return;
      }

      // Set the appropriate content type based on file extension
      const ext = path.extname(fullPath).toLowerCase();
      let contentType = 'application/octet-stream';

      if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
      } else if (ext === '.png') {
        contentType = 'image/png';
      } else if (ext === '.gif') {
        contentType = 'image/gif';
      } else if (ext === '.webp') {
        contentType = 'image/webp';
      } else if (ext === '.svg') {
        contentType = 'image/svg+xml';
      }

      // Send the image
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Image server running at http://localhost:${PORT}/`);
  console.log(`Serving images from: ${IMAGE_DIR}`);
});
