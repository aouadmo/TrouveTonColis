const express = require('express');
const router = express.Router();
const Colis = require('../models/colis');

// 🔹 Données de test "fictives"
const fakeColisList = [
  {
    trackingNumber: '1Ztrackdupontjean123',
    nom: 'Dupont',
    prenom: 'Jean',
    relais: {
      nom: 'point relais particulier de Cécile',
      adresse: '84 rue Gambetta 45140 Saint-Jean-de-la-Ruelle',
      horaires:
        'Lundi au vendredi : 10h - 16h<br/>Mardi : 10h - 20h<br/>Samedi : 14h - 17h<br/><br/>Soir sur rendez-vous :<br/>Lundi, mercredi, jeudi de 21h45 à 22h',
      infos:
        'Prévenir par SMS 10 minutes avant d’arriver. ',
    },
  },
  {
    trackingNumber: '1Ztrackmartinclaire123',
    nom: 'Martin',
    prenom: 'Claire',
    relais: {
      nom: 'point relais particulier de Cécile',
      adresse: '84 rue Gambetta 45140 Saint-Jean-de-la-Ruelle',
      horaires:
        'Lundi au vendredi : 10h - 16h<br/>Mardi : 10h - 20h<br/>Samedi : 14h - 17h<br/><br/>Soir sur rendez-vous :<br/>Lundi, mercredi, jeudi de 21h45 à 22h',
      infos:
        'Prévenir par SMS 10 minutes avant d’arriver.',
    },
  },
  {
    trackingNumber: '1Ztrackbernluc123',
    nom: 'Bernard',
    prenom: 'Luc',
    relais: {
      nom: 'point relais particulier de Cécile',
      adresse: '84 rue Gambetta 45140 Saint-Jean-de-la-Ruelle',
      horaires:
        'Lundi au vendredi : 10h - 16h<br/>Mardi : 10h - 20h<br/>Samedi : 14h - 17h<br/><br/>Soir sur rendez-vous :<br/>Lundi, mercredi, jeudi de 21h45 à 22h',
      infos:
        'Prévenir par SMS 10 minutes avant d’arriver.',
    },
  },
];

// 📦 Route 1 : recherche par numéro de suivi
router.get('/search/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;

  const fakeMatch = fakeColisList.find((colis) => colis.trackingNumber === trackingNumber);
  if (fakeMatch) {
    return res.json({ found: true, colis: fakeMatch, message: 'Colis fictif bien livré' });
  }
    const colis = await Colis.findOne({ trackingNumber });
    if (colis) {
      return res.json({ found: true, colis, message: 'Colis trouvé dans MongoDB' });
    } else {
      return res.status(404).json({ found: false, message: 'Colis pas encore arrivé' });
    }

});

// 👤 Route 2 : recherche par nom et prénom
router.post('/search/name', async (req, res) => {
  const nom = req.body.nom?.trim();
  const prenom = req.body.prenom?.trim();

  // 🔹 Colis fictifs (comparaison insensible à la casse + trim)
  const matchedFake = fakeColisList.filter(colis =>
    colis.nom.toLowerCase().trim() === nom.toLowerCase() &&
    colis.prenom.toLowerCase().trim() === prenom.toLowerCase()
  );

  if (matchedFake.length > 0) {
    return res.json({ found: true, colis: matchedFake, message: 'Colis fictifs trouvés' });
  }

  // 🔹 Recherche MongoDB insensible à la casse avec regex
  const colis = await Colis.find({
    nom: { $regex: `^${nom}$`, $options: 'i' },
    prenom: { $regex: `^${prenom}$`, $options: 'i' },
  });

  if (colis.length > 0) {
    res.json({ found: true, colis, message: 'Colis trouvés' });
  } else {
    res.status(404).json({ found: false, message: 'Aucun colis à ce nom' });
  }
});

module.exports = router;
