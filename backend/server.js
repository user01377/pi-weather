import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from "cors";
import morgan from 'morgan';
import apiRouter from './routes/nws-api.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const PORT = 8000;

// Determine environment
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.log("Running in development mode");

  // Enable CORS for dev frontend
  server.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }));

  // Use verbose logging
  server.use(morgan('dev'));
} else {
  console.log("Running in production mode");

  // Use combined logging in prod
  server.use(morgan('combined'));

  // Serve frontend static files
  server.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Parse JSON bodies
server.use(express.json());

// API routes
server.use('/', apiRouter);

// Catch-all for SPA routing (only needed in production)
if (!isDev) {
  server.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
