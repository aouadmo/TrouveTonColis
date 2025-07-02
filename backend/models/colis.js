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
  status: { type: String, default: 'en attente' },
  rdvConfirmed: { type: Boolean, default: false },

  rdvDate: Date, // Date et heure du RDV
  rdvRelayId: String, // ID du point relais pour le RDV
});

const Colis = mongoose.model('colis', colisSchema);

module.exports = Colis;