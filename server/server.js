// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todoRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const net = require('net');

// Load environment variables
dotenv.config();

const app = express();
const DEFAULT_PORT = process.env.PORT || 5000;

// Function to check if a port is in use
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(true); // Port is in use
    });
    server.once('listening', () => {
      server.close();
      resolve(false); // Port is free
    });
    server.listen(port);
  });
};

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Basic logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test endpoint to check if API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api', summaryRoutes);  // Mount the summary routes at /api

// Health check route
app.get('/', (req, res) => {
  res.send('Todo Summary Assistant API is running!');
});

// 404 handler
app.use('*', (req, res) => {
  console.log(` 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(' Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start the server with port checking
const startServer = async () => {
  let port = DEFAULT_PORT;
  const MAX_PORT_ATTEMPTS = 10;
  
  for (let attempt = 0; attempt < MAX_PORT_ATTEMPTS; attempt++) {
    const portInUse = await isPortInUse(port);
    
    if (!portInUse) {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Todo API: http://localhost:${port}/api/todos`);
        console.log(`Summary API: http://localhost:${port}/api/summarize`);
      });
      return;
    }
    
    console.log(`Port ${port} is already in use, trying ${port + 1}...`);
    port++;
  }
  
  console.error(`Could not find an available port after ${MAX_PORT_ATTEMPTS} attempts.`);
  process.exit(1);
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});