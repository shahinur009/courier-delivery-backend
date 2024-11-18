const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const corsOptions = require('./config/corsOptions');
const client = require('./config/db');

const usersRoutes = require('./routes/users'); // Routes

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
}));

// Routes
app.use('/api', usersRoutes);

module.exports = { app, client };
