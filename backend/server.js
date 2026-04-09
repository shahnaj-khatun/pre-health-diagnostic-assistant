const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connection established successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

//  route for testing
app.get('/', (req, res) => {
    res.send('Pre-Health Diagnostic System API is running...');
});

// Define routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptoms', require('./routes/symptoms'));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
