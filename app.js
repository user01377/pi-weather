const express = require('express');  // import express
const app = express();               // create an Express app
const PORT = 3000;                   // define a port

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
