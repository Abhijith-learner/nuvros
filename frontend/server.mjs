import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Serve the React build directory (build/ from create-react-app)
const distDir = join(__dirname, 'build');

const app = express();

// Serve static files from build
app.use(express.static(distDir));

// Note: No healthcheck endpoint is exposed from the frontend server

// Catch-all handler to serve index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

const port = 80;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
