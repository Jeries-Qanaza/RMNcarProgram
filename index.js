const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;


let isOccupied = false;
let booking_data;

const app = express();

app.use(bodyParser.json());

app.get('/car-status', (req, res) => {
  res.json({ isOccupied: isOccupied });
});

app.post('/update-car-status', (req, res) => {
  isOccupied = req.body.isCarOccupied;
  booking_data = req.body.booking;
  console.log("Start Data from Server");// to del
  console.log(booking_data);//
  console.log("End Data from Server");//
  res.send('Car status updated successfully.');
});

// Serve HTML, CSS, and JS files
app.use(express.static(__dirname)); // Serve static files from the current directory

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
