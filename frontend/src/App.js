// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';


// // Import the http module
// const http = require('http');

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//     // Only handle POST requests
//     if (req.method === 'POST' && req.url === '/api/landsat-data') {
//         let body = '';

//         // Listen for data chunks
//         req.on('data', chunk => {
//             body += chunk.toString(); // Convert Buffer to string
//         });

//         // Listen for the end of the request
//         req.on('end', () => {
//             const { startDate, endDate } = JSON.parse(body); // Parse JSON body

//             // Date manipulation or validation
//             const start = new Date(startDate);
//             const end = new Date(endDate);

//             // Respond with received data
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: 'Dates received!', startDate, endDate }));
//         });
//     } else {
//         res.writeHead(404);
//         res.end('Not Found');
//     }
// });

// // Start the server
// const PORT = 5000;
// server.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;




