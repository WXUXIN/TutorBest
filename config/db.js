const mongoose = require('mongoose');
const config = require('config');

// Get the mongoURI from default.json
const db = config.get('mongoURI');

const connectDB = async () => { 
    try {
        await mongoose.connect(db, {
            // These are to prevent deprecation warnings
            useNewUrlParser: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;