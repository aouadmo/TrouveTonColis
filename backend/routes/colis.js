const express = require('express');
const router = express.Router();
const Colis = require('../models/colis');
const FormData = require('form-data');
const fetch = require('node-fetch');





// Route 1 : recherche par tracking number
router.get('/search/:trackingNumber', async (req, res) => {
  const colis = await Colis.findOne({ trackingNumber: req.params.trackingNumber });

  if (colis) {
    res.json({ found: true, colis, message: 'Colis bien livré' });
  } else {
    res.status(404).json({ message: 'Colis pas encore arrivé' });
  }

});

//  Route 2 : recherche par nom et prénom 
router.post('/search/name', async (req, res) => {
  const { nom, prenom } = req.body;


  const colis = await Colis.find({ nom, prenom }); // on peut renvoyer plusieurs colis !

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

module.exports = router;
