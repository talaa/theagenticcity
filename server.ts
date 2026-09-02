import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.NODE_ENV !== 'development' &&
      fs.existsSync(path.join(process.cwd(), 'dist', 'index.html')));

  // Middleware to parse JSON
  app.use(express.json());

  // API Route - Mocking the FastAPI waitlist capture
  app.post('/api/waitlist', (req, res) => {
    const { name, email, interest_area } = req.body;
    
    if (!name || !email || !interest_area) {
      return res.status(400).json({ detail: "Missing required fields" });
    }
    
    if (!['Text2Clip', 'OVI', 'Aura'].includes(interest_area)) {
      return res.status(400).json({ detail: "Invalid area of interest" });
    }

    console.log(`[Mock FastAPI] New signup: ${name} (${email}) - ${interest_area}`);
    
    res.json({
      status: "success",
      message: "Welcome to the vanguard.",
      timestamp: new Date().toISOString()
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: "ok", service: "mock-express-backend" });
  });

  // Vite middleware for development vs static files for production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
