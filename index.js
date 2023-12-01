const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

let isCarOccupied = false;

app.get('/car-status', (req, res) => {
  res.json({ isOccupied: isCarOccupied });
});

app.post('/update-car-status', (req, res) => {
  isCarOccupied = req.body.isOccupied;
  res.send('Car status updated successfully.');
});

// Serve HTML, CSS, and JS files
app.use(express.static(__dirname)); // Serve static files from the current directory

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
