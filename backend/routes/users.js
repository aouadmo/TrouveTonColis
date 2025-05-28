var express = require('express');
var router = express.Router();

const Client = require('../models/clients');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
  const { nom, prenom, email, password, phone, client } = req.body;

  if (!checkBody(req.body, ['nom', 'prenom', 'email', 'password', 'phone', 'client'])) {
    res.json({ result: false, error: 'Tous les champs sont requis.' });
    return;
  }

  Client.findOne({ email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(password, 10);

      const newClient = new Client({
        nom,
        prenom,
        email,
        password: hash,
        phone,
        client,
        token: uid2(32),
      });

      return newClient.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, userId: newDoc._id });
      });
    } else {
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Tous les champs doivent être remplit.' });
    return;
  }

  Client.findOne({ email }).then(data => {
    if (data && bcrypt.compareSync( password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'Utilisateur ou mot de passe incorrect.' });
    }
  });
});

router.get('/client/:token', (req, res) => {
  Client.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, client: data.client });
    } else {
      res.json({ result: false, error: 'Utilisateur inconnu' });
    }
  });
});


module.exports = router;
