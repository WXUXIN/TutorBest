const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    "name": {
        "type": "String",
        "required": true
    },
    "email": {
        "type": "String",
        "required": true,
        "unique": true
    },
    "password": {
        "type": "String",
        "required": true
    },
    "avatar": {
        "type": "String"
    },
    "date": {
        "type": "Date",
        "default": Date.now
    }
});



// mongoose.model('user', UserSchema);
// The first argument 'user' specifies the name of the model. 
// The second argument UserSchema refers to the schema definition for the model. 
// It specifies the structure and validation rules for the documents in the collection.

// By calling mongoose.model('user', UserSchema), you create a Mongoose model named 'user' that corresponds to the 'users' 
// collection in the MongoDB database. 
// This model provides an interface for performing database operations (such as 
// creating, reading, updating, and deleting documents) 
// on the 'users' collection using Mongoose methods.


module.exports = User = mongoose.model('user', UserSchema);