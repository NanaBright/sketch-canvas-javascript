const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveFile(filePath, contentType, response) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>404 - Not Found</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background: #0a0a0a;
                color: white;
              }
              h1 { color: #8338ec; }
              a { color: #00f5ff; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1>404 - Page Not Found</h1>
            <p>The file you requested could not be found.</p>
            <p><a href="/">← Back to Creative Coding Museum</a></p>
          </body>
          </html>
        `);
      } else {
        // Server error
        response.writeHead(500);
        response.end('Server Error: ' + error.code);
      }
    } else {
      // Success
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
}

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Remove leading slash and resolve file path
  const filePath = path.join(__dirname, pathname.substring(1));

  // Get file extension
  const ext = path.parse(filePath).ext;

  // Determine content type
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Check if file exists and serve it
  fs.access(filePath, fs.constants.F_OK, (error) => {
    if (error) {
      // File doesn't exist, return 404
      serveFile('', 'text/html', response);
    } else {
      // File exists, serve it
      serveFile(filePath, contentType, response);
    }
  });
});

server.listen(port, () => {
  console.log(`🎨 Creative Coding Museum server running at:`);
  console.log(`   → Local:   http://localhost:${port}`);
  console.log(`   → Network: http://192.168.1.x:${port}`);
  console.log('');
  console.log('📁 Serving files from:', __dirname);
  console.log('');
  console.log('🎭 Available pages:');
  console.log(`   → Museum Gallery: http://localhost:${port}/`);
  console.log(`   → Sketch Viewer:  http://localhost:${port}/sketch-viewer.html`);
  console.log('');
  console.log('💡 Tips:');
  console.log('   • Press Ctrl+C to stop the server');
  console.log('   • Use canvas-sketch CLI for individual sketches');
  console.log('   • Check the README.md for more information');
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Creative Coding Museum server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});
