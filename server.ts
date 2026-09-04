import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.NODE_ENV !== 'development' &&
      fs.existsSync(path.join(process.cwd(), 'dist', 'index.html')));

  // Middleware to parse JSON
  app.use(express.json());

  // API Route - Capture Strategy Call leads and save to Airtable
  app.post('/api/strategy-call', async (req, res) => {
    try {
      const { name, email, description, source } = req.body;

      if (!name || !email) {
        return res.status(400).json({ detail: "Name and email are required." });
      }

      const airtableToken = process.env.AIRTABLE_ACCESS_TOKEN;
      const baseId = process.env.AIRTABLE_BASE_ID;
      const tableName = process.env.AIRTABLE_TABLE_NAME || 'Strategy_Calls';

      if (!airtableToken || !baseId) {
        console.warn("[Airtable] Missing Airtable configuration in .env");
        return res.status(500).json({ detail: "Airtable configuration missing on server." });
      }

      // Prepare fields payload for Airtable
      const fields: Record<string, any> = {
        Name: name,
        Email: email,
      };

      if (description) {
        fields['Project Description'] = description;
      }

      if (source) {
        fields['Source'] = source;
      }

      const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
      
      const response = await fetch(airtableUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            { fields }
          ],
          typecast: true
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        console.error("[Airtable Error]", data);
        return res.status(response.status).json({
          detail: data.error?.message || "Failed to submit to Airtable.",
          error: data.error
        });
      }

      console.log(`[Airtable] Successfully saved lead: ${name} (${email})`);
      return res.json({
        status: "success",
        message: "Strategy call request received.",
        id: data.records?.[0]?.id,
      });
    } catch (err: any) {
      console.error("[Strategy Call Endpoint Error]", err);
      return res.status(500).json({ detail: err.message || "Internal server error." });
    }
  });

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
