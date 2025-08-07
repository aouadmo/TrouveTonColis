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

// Sécuriser les RegExp
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


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


//  Recherche par nom et prénom 
router.post('/searchname', async (req, res) => {
  const { nom, prenom } = req.body;
  
  try {
    const colis = await Colis.find({
      nom: { $regex: new RegExp(`^${escapeRegex(nom)}$`, 'i') },
      prenom: { $regex: new RegExp(`^${escapeRegex(prenom)}$`, 'i') },
    });

    if (colis.length > 0) {
      console.log(' Envoi found: true');
      res.json({ found: true, colis });
    } else {
      console.log(' Envoi found: false');
      res.status(404).json({ found: false, message: 'Aucun colis à ce nom' });
    }
  } catch (error) {
    console.error(' Erreur:', error);
    res.status(500).json({ found: false, message: 'Erreur serveur' });
  }
});

// 🔧 FONCTIONS HELPER
function extractManually(text) {
  const result = { prenom: '', nom: '', telephone: '', trackingNumber: '' };
  
  // Téléphone français
  const phoneMatch = text.match(/(0[67]\d{8})/);
  if (phoneMatch) result.telephone = phoneMatch[0];
  
  //  TRACKING UPS ULTRA-AMÉLIORÉ
  console.log(" Recherche tracking dans le texte complet...");
  
  // Pattern 1: TRACKING + espaces + numéro
  const trackingPatterns = [
    /TRACKING[:\s#]*([I1]Z[\s\d\w]+)/gi,
    /TBACKING[:\s#]*([I1]Z[\s\d\w]+)/gi,
    /([I1]Z[\s\d\w]{10,})/gi,
  ];
  
  for (const pattern of trackingPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      console.log(" Pattern matches:", matches);
      for (const match of matches) {
        console.log(" Analyse du match:", match);
        
        // Extraire la partie tracking
        let trackingPart = match;
        trackingPart = trackingPart.replace(/TRACKING[:\s#]*/gi, '');
        trackingPart = trackingPart.replace(/TBACKING[:\s#]*/gi, '');
        
        console.log(" Partie tracking brute:", trackingPart);
        
        // Nettoyer et corriger
        let tracking = trackingPart.replace(/^IZ/i, '1Z');
        tracking = tracking.replace(/[^A-Z0-9]/g, '');
        
        console.log("🧹 Tracking nettoyé:", tracking);
        
        if (tracking.startsWith('1Z') && tracking.length >= 10) {
          result.trackingNumber = tracking;
          console.log(" TRACKING TROUVÉ:", result.trackingNumber);
          break;
        } else if (tracking.length >= 8) {
          result.trackingNumber = tracking;  
          console.log(" Tracking non-standard accepté:", result.trackingNumber);
          break;
        }
      }
      if (result.trackingNumber) break;
    }
  }
  
  // Nom simple (ligne avec 2 mots en majuscules)
  const lines = text.split(/[\r\n]+/);
  for (const line of lines) {
    const nameMatch = line.trim().match(/^([A-Z]{2,})\s+([A-Z]{2,})$/);
    if (nameMatch && !line.includes('RUE') && !line.includes('RELAIS') && !line.includes('SAINT')) {
      result.prenom = nameMatch[1];
      result.nom = nameMatch[2];
      console.log("👤 Nom trouvé:", result.prenom, result.nom);
      break;
    }
  }
  
  console.log(" RÉSULTAT FINAL extraction manuelle:", result);
  return result;
}

function cleanPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.match(/^0[67]\d{8}$/)) return cleaned;
  return '';
}

function cleanTracking(tracking) {
  if (!tracking) return '';
  console.log("🧹 Nettoyage tracking:", tracking);
  let cleaned = tracking.replace(/\s/g, '').toUpperCase();
  cleaned = cleaned.replace(/^IZ/i, '1Z');
  cleaned = cleaned.replace(/^1I/i, '1Z');
  console.log("🧹 Tracking nettoyé:", cleaned);
  if (cleaned.startsWith('1Z') && cleaned.length >= 10) {
    console.log(" Tracking UPS valide:", cleaned);
    return cleaned;
  }
  if (cleaned.length >= 8) {
    console.log(" Tracking non-UPS accepté:", cleaned);
    return cleaned;
  }
  console.log(" Tracking rejeté:", cleaned);
  return '';
}

function detectTransporteur(text) {
  const transporteurs = ['UPS', 'DHL', 'COLIS PRIVÉ', 'COLISSIMO', 'COLICOLIS'];
  for (const t of transporteurs) {
    if (text.toUpperCase().includes(t)) return t;
  }
  return '';
}

// === OCR + Hugging Face AI CORRIGÉ ===
const ocr_space_api = process.env.OCR_SPACE_API;

router.post('/ocr', async (req, res) => {
  const imageUrl = req.files.url;
  
  try {
    const formData = new FormData();
    formData.append('url', imageUrl.data, {
      filename: imageUrl.name,
      contentType: imageUrl.mimetype,
    });
    formData.append('filetype', 'JPG');
    formData.append('language', 'fre');
    formData.append('isOverlayRequired', 'false');

    console.log("📤 Envoi vers OCR.space...");
    const ocrRes = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      headers: { apikey: ocr_space_api },
    });

    const data = await ocrRes.json();
    console.log(" OCR Response:", data);
    const parsedText = data?.ParsedResults?.[0]?.ParsedText || '';
    console.log(" Texte extrait:", parsedText);

    //  FONCTION IA CORRIGÉE
    async function extractText(prompt) {
      try {
        console.log("🤖 Envoi vers Hugging Face...");
        const response = await hf.chatCompletion({
          model: 'mistralai/Mistral-7B-Instruct-v0.3',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.1
        });
        return response.choices[0].message.content;
      } catch (err) {
        console.error('💥 Erreur Hugging Face:', err);
        return null;
      }
    }
    
    //  PROMPT ULTRA-STRICT POUR JSON
    const prompt = `MISSION: Extraire les données d'étiquette de colis en JSON.

TEXTE: "${parsedText}"

INSTRUCTIONS:
1. Trouve le PRÉNOM et NOM du destinataire
2. Trouve le TÉLÉPHONE (06, 07, +336, +337)  
3. Trouve le TRACKING 
4. RÉPONDS UNIQUEMENT le JSON ci-dessous

RÉPONDS EXACTEMENT CECI (remplace les valeurs):
{"prenom": "HARMONY", "nom": "FLAMANT", "trackingNumber": "1Z123456789", "telephone": "0666925781"}

JSON SEULEMENT:`;

    let extractedData = {};
    
    //  ESSAYER L'IA D'ABORD
    const raw = await extractText(prompt);
    console.log('🤖 Réponse IA brute:', raw);
    
    if (raw) {
      try {
        // 🔧 EXTRACTION JSON AGRESSIVE
        let cleanResponse = raw.trim();
        
        // Supprimer tout avant le premier {
        const startIndex = cleanResponse.indexOf('{');
        if (startIndex !== -1) {
          cleanResponse = cleanResponse.substring(startIndex);
          
          // Supprimer tout après le dernier }
          const endIndex = cleanResponse.lastIndexOf('}');
          if (endIndex !== -1) {
            cleanResponse = cleanResponse.substring(0, endIndex + 1);
          }
        }
        
        console.log('🧹 JSON extrait:', cleanResponse);
        
        if (cleanResponse.startsWith('{') && cleanResponse.endsWith('}')) {
          extractedData = JSON.parse(cleanResponse);
          console.log(' Données extraites par IA:', extractedData);
        } else {
          throw new Error('Pas de JSON valide trouvé');
        }
        
      } catch (parseError) {
        console.log(' Erreur parsing IA:', parseError.message);
        console.log(' Passage en extraction manuelle...');
        extractedData = extractManually(parsedText);
      }
    } else {
      console.log(' IA non disponible, extraction manuelle...');
      extractedData = extractManually(parsedText);
    }

    //  VALIDATION ET NETTOYAGE DES DONNÉES
    const finalData = {
      prenom: (extractedData.prenom || '').trim(),
      nom: (extractedData.nom || '').trim(),
      telephone: cleanPhone(extractedData.telephone || ''),
      trackingNumber: cleanTracking(extractedData.trackingNumber || ''),
      transporteur: detectTransporteur(parsedText)
    };

    console.log(' Données finales:', finalData);

    //  CRÉATION DU COLIS
    const newColis = new Colis({
      nom: finalData.nom,
      prenom: finalData.prenom,
      phone: finalData.telephone,
      trackingNumber: finalData.trackingNumber,
      transporteur: finalData.transporteur,
      poids: '',
      date: new Date(),
      extractedFromOCR: {
        originalText: parsedText,
        aiResponse: raw,
        extractedData: finalData
      }
    });

    console.log(' Sauvegarde du colis...');
    await newColis.save();
    console.log(' Colis sauvé avec ID:', newColis._id);
    
    res.json({
      success: true,
      ocrText: parsedText,
      extractedData: finalData,
      colisId: newColis._id,
    });
    
  } catch (err) {
    console.error(' Erreur globale OCR:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur OCR ou AI', 
      error: err.message 
    });
  }
});

// Mise à jour d'un colis
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

//  Acces tout colis (pour MonStock côté Pro) 
router.get('/', async (req, res) => {
  try {
    const stock = await Colis.find();
    res.json({ result: true, stock });
  } catch (err) {
    res.status(500).json({ result: false, message: 'Erreur récupération stock' });
  }
});

// Pour les stats colis
router.get('/stats', async (req, res) => {
  try {
    const colis = await Colis.find();

    const stats = [0, 0, 0, 0];
    colis.forEach(c => {
      const date = new Date(c.date);
      const month = date.getMonth();
      if (month < 3) stats[0]++;
      else if (month < 6) stats[1]++;
      else if (month < 9) stats[2]++;
      else stats[3]++;
    });

    const best = Math.max(...stats);
    res.json({ result: true, data: stats, best });
  } catch (error) {
    console.error('Erreur /colis/stats :', error);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

//  Colis pour client connecté 
router.get('/mes-colis/:nom/:prenom', async (req, res) => {
  try {
    const { nom, prenom } = req.params;
    
    const colis = await Colis.find({
      nom: { $regex: new RegExp(`^${escapeRegex(nom)}$`, 'i') },
      prenom: { $regex: new RegExp(`^${escapeRegex(prenom)}$`, 'i') }
    }).sort({ date: -1 }); // Plus récents en premier
    
    res.json({ result: true, colis });
  } catch (error) {
    console.error('Erreur récupération colis client:', error);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

//  ROUTE DE TEST POUR DEBUG
router.get('/test-colis/:trackingNumber', async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    console.log(" Recherche colis:", trackingNumber);
    console.log(" Type tracking:", typeof trackingNumber);
    
    const colis = await Colis.findOne({ trackingNumber: trackingNumber });
    console.log(" TEST - Colis trouvé:", colis ? "OUI" : "NON");
    
    if (colis) {
      console.log(" TEST - Détails:", {
        _id: colis._id,
        trackingNumber: colis.trackingNumber,
        typeTracking: typeof colis.trackingNumber
      });
      res.json({ result: true, message: "Colis trouvé !", colis: colis });
    } else {
      res.json({ result: false, message: "Colis NON trouvé" });
    }
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

// === PUT Réserver un RDV avec date/heure ===
router.put('/reserver-rdv/:trackingNumber', async (req, res) => {
  try {
    const { rdvDate, relayId } = req.body;
    const trackingNumber = req.params.trackingNumber;
    
    console.log(" SERVEUR - Réservation RDV:", trackingNumber, rdvDate);
    
    const colisExiste = await Colis.findOne({ trackingNumber: trackingNumber });
    console.log(" Colis trouvé:", colisExiste ? "OUI" : "NON");
    
    if (colisExiste) {
      console.log(" Détails du colis:", {
        _id: colisExiste._id,
        nom: colisExiste.nom,
        prenom: colisExiste.prenom,
        trackingNumber: colisExiste.trackingNumber,
        typeTracking: typeof colisExiste.trackingNumber
      });
    }
    
    if (!colisExiste) {
      console.log(" SERVEUR - Colis non trouvé avec tracking:", trackingNumber);
      return res.status(404).json({ result: false, error: 'Colis non trouvé' });
    }
    
    const updated = await Colis.findOneAndUpdate(
      { trackingNumber: trackingNumber },
      { 
        rdvConfirmed: true, 
        status: 'RDV réservé',
        rdvDate: new Date(rdvDate),
        rdvRelayId: relayId
      },
      { new: true }
    );
    
    console.log(" SERVEUR - RDV confirmé pour:", updated.trackingNumber);
    res.json({ result: true, colis: updated });
    
  } catch (err) {
    console.error(" SERVEUR - Erreur réservation RDV:", err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

// Route pour confirmer qu'un colis est réservé via un RDV (ancienne)
router.put('/confirm-rdv/:trackingNumber', async (req, res) => {
  try {
    const updated = await Colis.findOneAndUpdate(
      { trackingNumber: req.params.trackingNumber },
      { rdvConfirmed: true, status: 'réservé' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ result: false, error: 'Colis non trouvé' });
    res.json({ result: true, colis: updated });
  } catch (err) {
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

module.exports = router;