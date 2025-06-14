var express = require('express');
const router = express.Router();

const Pro = require('../models/pro');
const SmsMessage = require('../models/smsMessage');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// Inscription Pro
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['nom', 'prenom', 'email', 'password', 'phone', 'nomRelais', 'adresse', 'ville', 'codePostal'])) {
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
        emailConfirm: req.body.emailConfirm,
        password: hash,
        phone: req.body.phone,
        phone2: req.body.phone2,
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
  })
})


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
      res.status(401).json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


// Authentification du token dans l'en-tête Authorization
const authenticatePro = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ result: false, error: 'Token manquant' });
  const pro = await Pro.findOne({ token });
  if (!pro) return res.status(401).json({ result: false, error: 'Token invalide' });
  req.pro = pro;
  next();
};

// Route PUT /sms pour créer ou modifier les messages personnalisés
router.put('/sms', authenticatePro, async (req, res) => {
  const { receptionMessage, reminderMessage, absentUrgentMessage, absentPlannedMessage } = req.body;

  if (!receptionMessage || !reminderMessage) {
    return res.status(400).json({ result: false, error: 'Champs manquants' });
  }

  const sms = await SmsMessage.findOneAndUpdate(
    { user: req.pro._id },
    {
      receptionMessage,
      reminderMessage,
      absentUrgentMessage,
      absentPlannedMessage,
    },
    { upsert: true, new: true }
  );

  res.json({ result: true, data: sms });
}
);


router.get('/sms', authenticatePro, async (req, res) => {
  const sms = await SmsMessage.findOne({ user: req.pro._id });
  if (!sms) return res.status(404).json({ result: false, error: 'Aucun message trouvé' });
  res.json({ result: true, data: sms });
});

module.exports = router;

