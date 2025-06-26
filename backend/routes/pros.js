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
        phoneConfirm: req.body.phoneConfirm,
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

// Route pour récupérer les adresses des professionnels
router.get('/adressepro/', (req, res) => {
  Pro.find().then(data => {
    if (data) {
      //console.log(data[6].adresse + ' ' + data[6].codePostal + ' ' + data[6].ville);
      const fullAdress = data[6].adresse + ' ' + data[6].codePostal + ' ' + data[6].ville;
      res.json({ result: true, adresse: fullAdress });
    } else {
      res.json({ result: false, error: 'Les infos du PR n\'ont pas été trouvées' });
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

//Route PUT pour MAJ des coordonnées du Relais Pro
router.put('/update', (req, res) => {
  const { token, nomRelais, adresse, codePostal, ville, phone } = req.body;

  if (!token) {
    return res.json({ result: false, error: 'Token manquant' });
  }

  Pro.findOneAndUpdate(
    { token },
    { nomRelais, adresse, codePostal, ville, phone },
    { new: true }
  )
    .then(updated => {
      if (updated) {
        res.json({ result: true });
      } else {
        res.json({ result: false, error: 'Point relais non trouvé' });
      }
    })
    .catch(err => res.json({ result: false, error: 'Erreur serveur' }));
});

//Route POST pour les absences programmées du relais
router.post('/absence', (req, res) => {
  const { token, startDate, endDate, reason } = req.body;

  if (!token || !startDate || !endDate) {
    return res.json({ result: false, error: 'Champs manquants' });
  }

  Pro.findOne({ token }).then(pro => {
    if (!pro) {
      return res.json({ result: false, error: 'Point relais introuvable' });
    }
    if (!pro.absences) pro.absences = [];

    pro.absences.push({ startDate, endDate, reason });

    pro.save().then(() => {
      res.json({ result: true });
    })
  });
});


// Route PUT pour mettre à jour les horaires du relais
router.put('/horaires', authenticatePro, async (req, res) => {
  const { horaires } = req.body;

  // Vérification basique
  if (!horaires || typeof horaires !== 'object') {
    return res.status(400).json({ result: false, error: 'Horaires manquants ou invalides' });
  }

  try {
    const updatedPro = await Pro.findOneAndUpdate(
      { token: req.pro.token },
      { horaires },
      { new: true }
    );

    if (!updatedPro) {
      return res.status(404).json({ result: false, error: 'Point relais introuvable' });
    }

    res.json({ result: true, message: 'Horaires mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des horaires :', error);
    res.status(500).json({ result: false, error: 'Erreur serveur lors de la mise à jour des horaires' });
  }
});

// Route PUT pour mettre à jour les horaires du relais
router.put('/horaires', authenticatePro, async (req, res) => {
  const { horaires } = req.body;

  // Vérification basique
  if (!horaires || typeof horaires !== 'object') {
    return res.status(400).json({ result: false, error: 'Horaires manquants ou invalides' });
  }

  try {
    const updatedPro = await Pro.findOneAndUpdate(
      { token: req.pro.token },
      { horaires },
      { new: true }
    );

    if (!updatedPro) {
      return res.status(404).json({ result: false, error: 'Point relais introuvable' });
    }

    res.json({ result: true, message: 'Horaires mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des horaires :', error);
    res.status(500).json({ result: false, error: 'Erreur serveur lors de la mise à jour des horaires' });
  }
});

// Route publique pour récupérer les infos d'un point relais (accessible sans authentification)
router.get('/info/:id', (req, res) => {
  const proId = req.params.id;
  
  // Vérifier que l'ID est valide
  if (!proId) {
    return res.status(400).json({ result: false, error: 'ID du point relais manquant' });
  }

  Pro.findById(proId)
    .select('nomRelais phone2 adresse ville codePostal horaires') // Sélectionner UNIQUEMENT les champs demandés
    .then(data => {
      if (!data) {
        return res.status(404).json({ result: false, error: 'Point relais non trouvé' });
      }
      
      // Retourner les données formatées
      res.json({ 
        result: true, 
        data: {
          id: data._id,
          nomRelais: data.nomRelais,
          phone2: data.phone2,
          adresse: data.adresse,
          ville: data.ville,
          codePostal: data.codePostal,
          horaires: data.horaires,
          adresseComplete: `${data.adresse}, ${data.codePostal} ${data.ville}`
        }
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du pro:', error);
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
});module.exports = router;

