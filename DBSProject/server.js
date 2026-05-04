const express = require('express');
const cors = require('cors');
const db = require('./config/dbConfig');
const compatibilityRoutes = require('./routes/compatibilityRoutes');
const authenticationRoutes = require('./routes/authentication');
const signupRoutes = require('./routes/signup');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Keep the old landing URL working.
app.get('/landing-page.html', (req, res) => {
    res.redirect('/index.html');
});

// Routes
app.use('/api', compatibilityRoutes);
app.use('/api', authenticationRoutes);
app.use('/api', signupRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});