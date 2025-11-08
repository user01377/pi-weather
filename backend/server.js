import express from 'express';
import apiRouter from './routes/nws-api.js';

const server = express();
const PORT = 8000;

server.get('/', (req, res) => {
  res.send("Weather API is LIVE");
});

server.use('/', apiRouter);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
