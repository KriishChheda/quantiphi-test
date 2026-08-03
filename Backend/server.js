const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// ===== Start Server =====
async function start() {
  await app.listen(PORT);
  console.log(`🚀 NutriTrack API running at http://localhost:${PORT}`);
}

start();
