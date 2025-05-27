const mongoose = require('mongoose');

const clientsSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    password: String,
    phone: Number,
    client: Boolean,
    token: String,
});

const Client = mongoose.model('clients', clientsSchema);

module.exports = Client;