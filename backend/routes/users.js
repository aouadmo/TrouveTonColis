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

    // Fonction pour formater le numéro de téléphone
    const formatPhone = (phone) => {
      if (!phone) return '';
      const phoneStr = phone.toString();
      
      // Ajouter le 0 si manquant pour les numéros français (9 chiffres)
      if (phoneStr.length === 9 && !phoneStr.startsWith('0')) {
        return '0' + phoneStr;
      }
      
      return phoneStr;
    };

    res.json({
      result: true,
      client: {
        nom: data.nom,
        prenom: data.prenom,
        phone: formatPhone(data.phone), // ⚠️ Formatage appliqué ici
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

    // Fonction pour formater le téléphone avant sauvegarde
    const formatPhoneForSave = (phone) => {
      if (!phone) return phone;
      // Force en string pour éviter la perte du 0
      return phone.toString();
    };

    // 🔁 Mise à jour des champs autorisés
    client.nom = req.body.lastName || client.nom;
    client.prenom = req.body.firstName || client.prenom;
    client.phone = formatPhoneForSave(req.body.phone) || client.phone; // ⚠️ Formatage appliqué
    client.email = req.body.email || client.email;

    client.save().then(() => {
      res.json({ result: true, message: 'Modifications enregistrées' });
    }).catch(error => {
      // ⚠️ Ajout de gestion d'erreur pour la sauvegarde
      res.status(500).json({ result: false, error: 'Erreur lors de la sauvegarde' });
    });
  }).catch(error => {
    // ⚠️ Ajout de gestion d'erreur pour la recherche
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  });
});


module.exports = router;
