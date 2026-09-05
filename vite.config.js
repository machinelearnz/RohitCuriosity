import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin: Local image upload endpoint.
 * Receives a Base64 image POST to /api/upload and writes the binary file
 * directly to public/images/ on disk, returning the static path.
 * This eliminates Base64 strings from .md files and Git history.
 */
function imageUploadPlugin() {
  return {
    name: 'vite-plugin-image-upload',
    configureServer(server) {
      server.middlewares.use('/api/upload', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const { dataUrl, filename } = JSON.parse(body);

            if (!dataUrl || !dataUrl.startsWith('data:image/')) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid image data URL' }));
              return;
            }

            // Extract MIME type and base64 payload
            const mimeMatch = dataUrl.match(/^data:image\/([\w+]+);base64,/);
            if (!mimeMatch) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid Base64 image format' }));
              return;
            }

            const ext = mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1];
            const base64Data = dataUrl.replace(/^data:image\/[\w+]+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            // Generate a clean filename
            const safeName = (filename || '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
            const fileId = `img_${Date.now()}_${safeName || Math.random().toString(36).substr(2, 5)}`;
            const outputFilename = `${fileId}.${ext}`;

            // Ensure public/images/ exists
            const imagesDir = path.resolve(process.cwd(), 'public', 'images');
            if (!fs.existsSync(imagesDir)) {
              fs.mkdirSync(imagesDir, { recursive: true });
            }

            // Write the binary file to disk
            const outputPath = path.join(imagesDir, outputFilename);
            fs.writeFileSync(outputPath, buffer);

            console.log(`[upload] Saved ${(buffer.length / 1024).toFixed(1)}KB → public/images/${outputFilename}`);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              path: `/images/${outputFilename}`,
              filename: outputFilename,
              size: buffer.length
            }));
          } catch (err) {
            console.error('[upload] Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Upload failed: ' + err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), imageUploadPlugin()],
  assetsInclude: ['**/*.md'],
  server: {
    port: 3000,
    open: true
  }
});
