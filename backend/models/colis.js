const mongoose = require('mongoose');

const colisSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    trackingNumber: String,
    transporteur: String,
    phone: Number,
    poids: Number,
    date: Date,
<<<<<<< HEAD
=======
    extractedFromOCR: Object,
>>>>>>> mohamed-codebarscan-feature
});

const Colis = mongoose.model('colis', colisSchema);

module.exports = Colis;