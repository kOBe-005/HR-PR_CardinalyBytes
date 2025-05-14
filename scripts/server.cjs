/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// Set security headers
app.use((_, res, next) => {
  res.set({
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Origin-Agent-Cluster': '?1',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*', // Be mindful of security
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, X-Origin, X-State, X-Encoding, Content-Type, Accept, Range',
    'Content-Security-Policy':
      "default-src 'self' blob: data: https://api.rouast.com; " +
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' blob: https://unpkg.com/ https://cdn.jsdelivr.net; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://unpkg.com/ https://cdn.jsdelivr.net; " +
      "worker-src 'self' blob:; " +
      "connect-src 'self' blob: data: https://unpkg.com/ https://cdn.jsdelivr.net https://api.rouast.com; " +
      "img-src 'self' data: blob:; " + // Added blob: for images, ensure it's appropriate
      "style-src 'self' 'unsafe-inline';",
  });
  next();
});

// --- NEW: Serve the statically exported Next.js app ---
const nextAppPath = path.join(__dirname, '../src/frontend/out');
// Serve static files from the Next.js export directory (_next, images, etc.)
app.use(express.static(nextAppPath));
// --- END NEW ---

// Serve static files for original examples and dist (like vitallens.browser.js)
app.use(express.static(path.join(__dirname, '../dist'))); // For vitallens.browser.js if needed by examples
app.use('/examples', express.static(path.join(__dirname, '../examples'))); // Serve examples under /examples path
app.use('/assets', express.static(path.join(__dirname, '../assets'))); // Serve root assets

// Handle dynamic browser examples (like webcam_widget, file_widget)
// These are now explicitly under /browser/ to avoid conflict with Next.js routes
app.get('/browser/:example', (req, res) => {
  const example = req.params.example;
  if (example.includes('..')) {
    return res.status(400).send('Invalid example name');
  }
  // Construct path assuming .html extension
  const examplePath = path.join(
    __dirname,
    '../examples',
    'browser',
    example.endsWith('.html') ? example : example + '.html'
  );

  fs.readFile(examplePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${examplePath}:`, err);
      if (err.code === 'ENOENT') {
        return res.status(404).send('Example not found. Note: Ensure you are accessing via /browser/example.html');
      } else {
        return res.status(500).send('Error loading example');
      }
    }
    const apiKey = process.env.API_KEY || 'YOUR_API_KEY';
    const updatedHTML = data.replace(/YOUR_API_KEY/g, apiKey);
    res.send(updatedHTML);
  });
});

// --- NEW: Catch-all for Next.js HTML files (e.g. /use-cases should serve /use-cases.html) ---
// This handles client-side routing for Next.js if a direct file match isn't found by express.static
// It also serves the main index.html for the root path.
app.get('*_API_KEY', (req, res) => {
  // Try to serve a corresponding .html file from the Next.js output
  const filePath = path.join(nextAppPath, req.path.endsWith('.html') ? req.path : `${req.path}.html`);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      res.sendFile(filePath);
    } else {
      // If no specific .html file, serve the main index.html (for SPA-like behavior on refresh)
      res.sendFile(path.join(nextAppPath, 'index.html'), (serveErr) => {
        if (serveErr) {
          // If index.html also doesn't exist (e.g., before first build), send 404
          console.error('Error serving index.html for Next.js app:', serveErr);
          res.status(404).send('Page not found. Ensure the Next.js app has been built (npm run build in src/frontend).');
        }
      });
    }
  });
});
// --- END NEW ---


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access the landing page at: http://localhost:${PORT}/`);
  console.log(`Original examples are available under /browser/ (e.g., http://localhost:${PORT}/browser/webcam_widget.html)`);

  const urlToOpen = `http://localhost:${PORT}/`; // Default to Next.js landing page

  if (process.env.NODE_ENV !== 'test' && !process.env.CI) {
    const platform = process.platform;
    let command;
    if (platform === 'win32') {
      command = `start ${urlToOpen}`;
    } else if (platform === 'darwin') {
      command = `open ${urlToOpen}`;
    } else {
      command = `xdg-open ${urlToOpen}`;
    }
    console.log(`Attempting to open browser at: ${urlToOpen}`);
    exec(command, (error) => {
      if (error) {
        console.error(`Failed to open browser: ${error.message}`);
        console.log(`Please manually open your browser to: ${urlToOpen}`);
      }
    });
  }
});
