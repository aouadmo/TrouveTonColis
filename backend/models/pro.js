const mongoose = require('mongoose');

const prosSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    password: String,
    phone: String,
    phoneConfirm: String,
    phone2: String,
    nomRelais: String,
    adresse: String,
    ville: String,
    codePostal: Number,
    token: String,
    absences: [
        {
          startDate: String,
          endDate: String,
          reason: String,
        }
      ],
      horaires: {
        lundi: {
          matin: { ouverture: String, fermeture: String },
          apresMidi: { ouverture: String, fermeture: String },
          ferme: Boolean,
        },
        mardi: {
          matin: { ouverture: String, fermeture: String },
          apresMidi: { ouverture: String, fermeture: String },
          ferme: Boolean,
        },
        mercredi: { 
          matin: {ouverture: String, fermeture: String}, 
          apresMidi: {ouverture: String, fermeture: String}, 
          ferme: Boolean },
        jeudi: { 
          matin: {ouverture: String, fermeture: String}, 
          apresMidi: {ouverture: String, fermeture: String}, 
          ferme: Boolean },
        vendredi: { 
          matin: {ouverture: String, fermeture: String}, 
          apresMidi: {ouverture: String, fermeture: String}, 
          ferme: Boolean },
        samedi: { 
          matin: {ouverture: String, fermeture: String}, 
          apresMidi: {ouverture: String, fermeture: String}, 
         ferme: Boolean },
        dimanche: { 
          matin: {ouverture: String, fermeture: String}, 
          apresMidi: {ouverture: String, fermeture: String}, 
          ferme: Boolean },
      },  
});

const Pro = mongoose.model('pros', prosSchema);

module.exports = Pro;

