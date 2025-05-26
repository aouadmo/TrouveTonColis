
const mongoose = require('mongoose');

const prosSchema = mongoose.Schema({


// pro 

client: {type: mongoose.Schema.Types.ObjectId, ref: 'clients'},

phone2 : Number,
adresse : String,
ville : String,
codePostal : Number,

});


const Pros = mongoose.model('pros', prosSchema);

module.exports = Pros;

