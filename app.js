const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const corsOptions = require('./config/corsOptions');
const client = require('./config/db');

// Import routes
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
}));

// Use routes
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);

module.exports = { app, client };
