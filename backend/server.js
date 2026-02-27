require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');
const todoRoutes = require('./src/routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// allow requests from the frontend; in production set CORS_ORIGIN to your deployed client URL
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/todos', todoRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));