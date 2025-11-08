import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from "cors";
import morgan from 'morgan';
import apiRouter from './routes/nws-api.js';

const server = express();
const PORT = 8000;

if (process.env.NODE_ENV === 'development') {
  server.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }));
}

server.use(express.json());

server.use(morgan('combined')) // for realtime logging like django

server.get('/', (req, res) => {
  res.json("Weather API is LIVE")
});

server.use('/', apiRouter);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
