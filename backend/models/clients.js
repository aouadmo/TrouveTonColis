const mongoose = require('mongoose');

const clientsSchema = mongoose.Schema({
    client: [String],
    nom: String,
    prenom: String,
    email: String,
    password: String,
    token: String,
    phone: Number,
    phoneConfirm: Number,

});

const Client = mongoose.model('clients', clientsSchema);

module.exports = Client;