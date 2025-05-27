var express = require('express');
var router = express.Router();

require('../models/connection');
const Pro = require('../models/pros');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// Inscription Pro
router.post('/pros/signup', (req, res) => {
  if (!checkBody(req.body, ['client', 'phone2', 'adresse', 'ville', 'codePostal'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // Check si déjà existant ?
  Pro.findOne({ username: req.body.email }).populate(client).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newPro = new Pro({ // pour la création de mon nouveau pro est-ce que je dois remettre toutes les clés du schéma client en plus de celles du schéma pro ? 
        client: req.body.client,
        phone2: req.body.phone2,
        adresse: req.body.adress,
        ville: req.body.ville,
        codePostal: req.body.codePostal,
      });

      newPro.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // Pro already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
})})


// Connexion Pro
router.post('/pros/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

Pro.findOne({ username: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


module.exports = router;
