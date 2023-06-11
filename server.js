const express = require('express');
const connectDB = require('./config/db');
const app = express();
const path = require('path');

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// app.get('/', (req, res) => res.send('API Running'));

// Define Routes
// Relate the following routes to the following middleware
app.use('/api/users', require('./routes/api/users')); 
app.use('/api/post', require('./routes/api/post')); 
app.use('/api/profile', require('./routes/api/profile')); 
app.use('/api/auth', require('./routes/api/auth')); 
app.use('/api/tutorReg', require('./routes/api/tutorReg')); 
app.use('/api/tutorData', require('./routes/api/tutorData')); 
app.use('/api/tutorSettings', require('./routes/api/tutorSettings')); 

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  