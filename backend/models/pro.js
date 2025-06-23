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
      
});

const Pro = mongoose.model('pros', prosSchema);

module.exports = Pro;

