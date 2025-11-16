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

if (process.env.NODE_ENV === 'development') {
  server.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }));
}

server.use(express.json());
server.use(morgan('combined'));

// Serve frontend static files from frontend/dist
server.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
server.use('/', apiRouter);

// Catch-all for SPA routing
server.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

server.listen(PORT);
