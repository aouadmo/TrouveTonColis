var express = require('express');
const router = express.Router();

const Pro = require('../models/pro');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// Inscription Pro
router.post('/signup', (req, res) => {
<<<<<<< HEAD
  if (!checkBody(req.body, ['nom', 'prenom', 'email', 'password', 'phone', 'nomRelais', 'adresse', 'ville', 'codePostal'])) {
=======
  if (!checkBody(req.body, ['nom', 'prenom', 'email', 'password', 'phone','nomRelais', 'adresse', 'ville', 'codePostal'])) {
>>>>>>> mohamed-codebarscan-feature
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // Check si déjà existant ?
  Pro.findOne({ email: req.body.email }).then(data => {
    if (data === null) {

      const hash = bcrypt.hashSync(req.body.password, 10);
      const token = uid2(32);

      const newPro = new Pro({  
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
<<<<<<< HEAD
        emailConfirm: req.body.emailConfirm,
        password: hash,
        phone: req.body.phone,
        phone2: req.body.phone2,
=======
        password: hash,
        phone: req.body.phone,
>>>>>>> mohamed-codebarscan-feature
        nomRelais: req.body.nomRelais,
        adresse: req.body.adresse,
        ville: req.body.ville,
        codePostal: req.body.codePostal,
        token: token,
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
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

Pro.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
<<<<<<< HEAD
      res.status(401).json({ result: false, error: 'User not found or wrong password' });
=======
      res.json({ result: false, error: 'User not found or wrong password' });
>>>>>>> mohamed-codebarscan-feature
    }
  });
});


module.exports = router;

