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

// route pour récupéré les infos du client
router.get('/client/:token', (req, res) => {
  Client.findOne({ token: req.params.token }).then(data => {

    if (!data) {
      return res.json({ result: false, error: 'Utilisateur inconnu' });
    }

    res.json({
      result: true,
      client: {
        nom: data.nom,
        prenom: data.prenom,
        phone: data.phone,
        email: data.email,
        loginEmail: data.loginEmail || '',
      }
    });
  });
});

// 🔄 PUT /users/update — mise à jour des infos du client
router.put('/update', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ result: false, error: 'Token manquant' });
  }

  Client.findOne({ token }).then(client => {
    if (!client) {
      return res.status(404).json({ result: false, error: 'Utilisateur non trouvé' });
    }

    // 🔁 Mise à jour des champs autorisés
    client.nom = req.body.lastName || client.nom;
    client.prenom = req.body.firstName || client.prenom;
    client.phone = req.body.phone || client.phone;
    client.email = req.body.email || client.email;

    client.save().then(() => {
      res.json({ result: true, message: 'Modifications enregistrées' });
    });
  });
});



module.exports = router;
