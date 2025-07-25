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
    },
  ],

  horaires: {
    type: Map,
    of: new mongoose.Schema({
      matin: {
        ouverture: String,
        fermeture: String,
      },
      apresMidi: {
        ouverture: String,
        fermeture: String,
      },
      ferme: Boolean,
    }, { _id: false }),
  },
});

const Pro = mongoose.model('pros', prosSchema);
module.exports = Pro;
