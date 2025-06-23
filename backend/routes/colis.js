const express = require('express');
const router = express.Router();
const Colis = require('../models/colis');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fetch = require('node-fetch');
const {groupByPeriod} = require('../modules/groupByPeriod')
const { InferenceClient } = require('@huggingface/inference');

dotenv.config();
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// 🔐 Helper pour sécuriser les RegExp
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// === GET by Tracking Number ===
router.get('/search/:trackingNumber', async (req, res) => {
  try {
    const colis = await Colis.findOne({ trackingNumber: req.params.trackingNumber });
    if (colis) {
      res.json({ found: true, colis });
    } else {
      res.status(404).json({ found: false, message: 'Colis pas encore arrivé' });
    }
  } catch (error) {
    res.status(500).json({ found: false, message: 'Erreur serveur' });
  }
});

//  Route 2 : recherche par nom et prénom 
router.post('/searchname', async (req, res) => {
  const { nom, prenom } = req.body;
  
  console.log('🔍 Recherche reçue:', { nom, prenom });
  
  try {
    const colis = await Colis.find({
      nom: { $regex: new RegExp(`^${escapeRegex(nom)}$`, 'i') },
      prenom: { $regex: new RegExp(`^${escapeRegex(prenom)}$`, 'i') },
    });

    console.log('📦 Résultats trouvés:', colis);
    console.log('📊 Nombre de résultats:', colis.length);
    console.log('🔢 Type de colis.length:', typeof colis.length);

    if (colis.length > 0) {
      console.log('✅ Envoi found: true');
      res.json({ found: true, colis });
    } else {
      console.log('❌ Envoi found: false');
      res.status(404).json({ found: false, message: 'Aucun colis à ce nom' });
    }
  } catch (error) {
    console.error('💥 Erreur:', error);
    res.status(500).json({ found: false, message: 'Erreur serveur' });
  }
});
// === OCR + Hugging Face AI ===
const ocr_space_api = process.env.OCR_SPACE_API;

router.post('/ocr', async (req, res) => {
  const imageUrl = req.files.url;
  const formData = new FormData();

  formData.append('url', imageUrl.data, {
    filename: imageUrl.name,
    contentType: imageUrl.mimetype,
  });
  formData.append('filetype', 'JPG');
  formData.append('language', 'fre');
  formData.append('isOverlayRequired', 'false');

  try {
    const ocrRes = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      headers: { apikey: ocr_space_api },
    });

    const data = await ocrRes.json();
    console.log(data);
    const parsedText = data?.ParsedResults?.[0]?.ParsedText || '';

    async function extractText(prompt) {
      try {
        const response = await hf.chatCompletion({
          model: 'mistralai/Mistral-7B-Instruct-v0.3',
          messages: [{ role: 'user', content: prompt }],
        });
        return response.choices[0].message.content;
      } catch (err) {
        console.error('Erreur Hugging Face:', err);
        return null;
      }
    }
    // les ordes à donner au robot
    const prompt = `
    Extrait le prénom (first name of the *recipient*), le nom (last name of the *recipient*), le numeros de  tracking et le numéro de téléphone du texte suivant.
    Pour le numéro de téléphone, cherche spécifiquement celui qui est précédé par "Tel : " ou "Téléphone :", assure toi que chaque numéros de telephone est cohérent en France (06, 07 ou 336, 337) de tel sorte que l'on puisse envoyer un SMS.
    le tracking est toujours au format "1Z" suivi de 11 caractères.
    Si une information (prénom, nom, tracking, téléphone) n'est pas trouvée, laisse sa valeur vide ("").
    Retourne la réponse uniquement en JSON strict, sans texte supplémentaire ni formatage Markdown (pas de \`\`\`json).
  
    Exemple:
    Texte: "Nom: Dupont, Prénom: Jean, Adresse: 123 Rue de la Paix, Tel: 0123456789", trackingNumber: "1Z23456789"
    {"prenom": "Jean", "nom": "Dupont", "trackingNumber": "1Z23456789", "telephone": "0123456789" }
  
    Texte: "Entreprise ABC, Service Client, trackingNumber: 1Z753159, Contact: 0687654321"
    {"prenom": "", "nom": "", "trackingNumber": "1Z753159", "telephone": "0687654321"}
  
    Texte :
    ${parsedText}
    `;

    const raw = await extractText(prompt);
    let extractedData;

    try {
      extractedData = JSON.parse(raw);
    } catch (err) {
      extractedData = { error: 'JSON mal formé', rawResponse: raw };
    }
      console.log('Extracted Data:', extractedData);
    const newColis = new Colis({
      nom: extractedData.nom || '',
      prenom: extractedData.prenom || '',
      phone: extractedData.telephone || '',
      trackingNumber: extractedData.trackingNumber || '',
      transporteur: extractedData.transporteur || '',
      poids: extractedData.poids || '',
      date: extractedData.date || new Date(),
      extractedFromOCR: extractedData,
    });

    await newColis.save();
    res.json({
      success: true,
      ocrText: parsedText,
      extractedData,
      colisId: newColis._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur OCR ou AI', error: err.message });
  }
});

// === PUT (mise à jour d’un colis) ===
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.phone) {
    updates.phone = String(updates.phone).replace(/\D/g, '');
  }
  if (updates.poids) {
    const p = parseFloat(updates.poids);
    if (!isNaN(p)) updates.poids = p;
    else delete updates.poids;
  }
  if (updates.date) {
    const d = new Date(updates.date);
    if (!isNaN(d)) updates.date = d;
    else delete updates.date;
  }

  try {
    const updatedColis = await Colis.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!updatedColis) return res.status(404).json({ success: false, message: 'Colis non trouvé' });
    res.json({ success: true, colis: updatedColis });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

// === GET All Colis (pour MonStock côté Pro) ===
router.get('/', async (req, res) => {
  try {
    const stock = await Colis.find();
    res.json({ result: true, stock });
  } catch (err) {
    res.status(500).json({ result: false, message: 'Erreur récupération stock' });
  }
});

module.exports = router;
