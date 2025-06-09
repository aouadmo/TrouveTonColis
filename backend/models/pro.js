const mongoose = require('mongoose');

const prosSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    emailConfirm: String,
    password: String,
    phone: String,
    phone2: String,
    nomRelais: String,
    adresse: String,
    ville: String,
    codePostal: Number,
    token: String,
});

const Pro = mongoose.model('pros', prosSchema);

module.exports = Pro;

