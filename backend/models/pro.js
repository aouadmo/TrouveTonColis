const mongoose = require('mongoose');

const prosSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
<<<<<<< HEAD
    emailConfirm: String,
    password: String,
    phone: String,
    phone2: String,
=======
    password: String,
    phone: Number,
>>>>>>> mohamed-codebarscan-feature
    nomRelais: String,
    adresse: String,
    ville: String,
    codePostal: Number,
    token: String,
});

const Pro = mongoose.model('pros', prosSchema);

module.exports = Pro;

