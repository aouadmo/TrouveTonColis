
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({



// client

nom : String,
prenom : String,
email : String,
password : String,
phone : Number,
client : Boolean,
token : String,

});




const User = mongoose.model('users', userSchema);

module.exports = User;