const express = require('express');
const router = express.Router();
const Colis = require('../models/colis');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Route 1 : recherche par tracking number
router.get('/search/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;

  // 🔹 Colis de test "en dur"
  const fakeColisList = [
    {
      trackingNumber: '1Ztrackdupontjean123',
      nom: 'Dupont',
      prenom: 'Jean',
      relais: {
        nom: 'Chez cécile',
        adresse: '84 rue gambetta 45140 SJDLR',
        horaires: 'Lundi au vendredi : 10h - 16h <br/> Samedi : 14h - 17h <br/> mardi : 10h - 20h',
        infos: 'Prévenir 10 minutes avant d\'arriver. proccuration par sms puis venir avec les 2 pieces d\identité',
      },
    },
    {
      trackingNumber: '1Ztrackmartinclaire123',
      nom: 'Martin',
      prenom: 'Claire',
      relais: {
        nom: 'Chez cécile',
        adresse: '84 rue gambetta 45140 SJDLR',
        horaires: 'Lundi au vendredi : 10h - 16h <br/> Samedi : 14h - 17h <br/> mardi : 10h - 20h',
        infos: 'Prévenir 10 minutes avant d\'arriver. proccuration par sms puis venir avec les 2 pieces d\identité',
      },
    },
    {
      trackingNumber: '1Ztrackbernluc123',
      nom: 'Bernard',
      prenom: 'Luc',
      relais: {
        nom: 'Chez cécile',
        adresse: '84 rue gambetta 45140 SJDLR',
        horaires: 'Lundi au vendredi : 10h - 16h <br/> Samedi : 14h - 17h <br/> mardi : 10h - 20h',
        infos: 'Prévenir 10 minutes avant d\'arriver. proccuration par sms puis venir avec les 2 pieces d\identité',
      },
    },
  ];

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

  // 🔹 Sinon, chercher dans la base Mongo
  const colis = await Colis.find({ nom, prenom });

  if (colis.length > 0) {
    res.json({ found: true, colis, message: 'Colis trouvés' });
  } else {
    res.status(404).json({ found: false, message: 'Aucun colis à ce nom' });
  }


  if (colis.length > 0) {
    res.json({ found: true, colis, message: 'Colis trouvés' });
  } else {
    res.status(404).json({ found: false, message: 'Aucun colis à ce nom' });
  }
});

// Extraction du Texte dans les images a partir du service OCR space  
const ocr_space_api = process.env.OCR_SPACE_API;
router.post('/ocr', async (req, res) => {
  const imageUrl = req.files.url;
  const formData = new FormData();
  formData.append('url', imageUrl.data, {
    filename: imageUrl.name,
    contentType: imageUrl.mimetype,
  });
  formData.append('filetype', 'JPG');
  console.log('imageUrl:', imageUrl);
  // if (!imageUrl) {
  //   return res.status(400).json({ message: 'Image URL is required' });
  // }

  try {
    formData.append('language', 'fre');
    formData.append('isOverlayRequired', 'false');
    console.log('formData:', formData);
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      headers: {
        apikey: ocr_space_api,

      },

    });

    const data = await response.json();
    console.log(data);
    if (data.IsErroredOnProcessing) {
      return res.status(500).json({ message: 'Error processing image', details: data.ErrorMessage });
    }

    const parsedText = data; // data.ParsedResults[0].ParsedText; // Uncomment if you want just the text

    res.json({ text: parsedText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//route get pour récupérer tous les colis et les afficher dans le stock colis côté pro
router.get('/', async (req, res) => {
const stock = await Colis.find(); 
    res.json({ result: true, stock });
});

module.exports = router;
