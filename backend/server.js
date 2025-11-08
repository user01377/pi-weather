const express = require('express');  
const server = express();               
const PORT = 8000;                   
import apiRouter from "./routes/nws-api.js"

server.get('/', (req, res) => {
  
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
