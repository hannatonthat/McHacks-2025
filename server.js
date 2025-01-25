const express = require('express');

// ENV
require('dotenv').config();

// Express App
const app = express();

// Middleware
app.use(express.json());

// Listen for requests
app.listen(process.env.PORT, () => {
    console.log('Server is listening on port', process.env.PORT);
});

// Routes Import
const MainRoutes = require('./routes/MainRoutes');

// Routes
app.use('/api/main/',MainRoutes);
