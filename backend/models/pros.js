const mongoose = require('mongoose');

const prosSchema = mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'clients' },
    phone2: Number,
    adresse: String,
    ville: String,
    codePostal: Number,
});

const Pro = mongoose.model('pros', prosSchema);

module.exports = Pro;

