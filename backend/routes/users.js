 var express = require('express');
 var router = express.Router();

const Client = require('../models/clients');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
  const { nom, prenom, email, password, phone, client } = req.body;

  if (!checkBody(req.body, ['nom', 'prenom', 'email', 'password', 'phone'])) {
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
  const password = req.body.password;
  if (!checkBody(req.body, ['email', 'password'])) {
    return res.status(400).json({ result: false, error: 'Tous les champs doivent être remplis.' });
  }

  Client.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.status(200).json({ result: true, token: data.token, userId: data._id });
    } else {
      res.status(401).json({ result: false, error: 'Utilisateur ou mot de passe incorrect.' });
      //res.json({ result: true, token: data.token });
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
