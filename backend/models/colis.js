const mongoose = require('mongoose');

const colisSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    trackingNumber: String,
    transporteur: String,
    phone: Number,
    poids: Number,
    date: Date,
    extractedFromOCR: Object,
    status: { type: String, default: 'en attente' }, // Pour suivi
    rdvConfirmed: { type: Boolean, default: false }, // Pour réservation
  });

const Colis = mongoose.model('colis', colisSchema);

module.exports = Colis;