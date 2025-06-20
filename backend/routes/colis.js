const { InferenceClient } = require("@huggingface/inference");
const dotenv = require("dotenv");
const express = require('express');
const router = express.Router();
const Colis = require('../models/colis');
const FormData = require('form-data');
const fetch = require('node-fetch');
const {groupByPeriod} = require('../modules/groupByPeriod')
//const { spawn } = require('child_process');
dotenv.config();
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);



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
  //console.log('imageUrl:', imageUrl);
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
    if (data.IsErroredOnProcessing) {
      return res.status(500).json({ message: 'Error processing image', details: data.ErrorMessage });
    }

    const parsedText = data.ParsedResults && data.ParsedResults.length > 0? data.ParsedResults[0].ParsedText: ''; // data.ParsedResults[0].ParsedText; or response.data?.ParsedResults?.[0]?.ParsedText
    //res.json({ text: parsedText });
    console.log('Parsed text from OCR.space:', parsedText);
    // send the parsed text to the Hugging Face model for further processing
    async function extractText(prompt) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            messages: [{ role: 'user', content: prompt }]
        });
        console.log("Full Hugging Face API Response Object in Node.js:", JSON.stringify(response, null, 2));
        console.log("Réponse du modèle :", response.choices[0].message.content);
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Erreur lors de la requête à l’API Hugging Face :", error);
        return null;
    }
}
  // const prompt = `
  // Extrait le prénom, le nom et le numéro de téléphone du texte suivant.
  // Donne la réponse en JSON :
  // {"prenom": "", "nom": "", "telephone": ""}  
  // Texte :
  // ${parsedText}  
  // `;
  const prompt = `
  Extrait le prénom (first name of the *recipient*), le nom (last name of the *recipient*), et le numéro de téléphone du texte suivant.
  Pour le numéro de téléphone, cherche spécifiquement celui qui est précédé par "Tel : " ou "Téléphone :".
  Si une information (prénom, nom, téléphone) n'est pas trouvée, laisse sa valeur vide ("").
  Retourne la réponse uniquement en JSON strict, sans texte supplémentaire ni formatage Markdown (pas de \`\`\`json).

  Exemple:
  Texte: "Nom: Dupont, Prénom: Jean, Adresse: 123 Rue de la Paix, Tel: 0123456789"
  {"prenom": "Jean", "nom": "Dupont", "telephone": "0123456789"}

  Texte: "Entreprise ABC, Service Client, Contact: 0987654321"
  {"prenom": "", "nom": "", "telephone": "0987654321"}

  Texte :
  ${parsedText}
  `;
  const extractedInfoRaw = await extractText(prompt);
  console.log('Extracted Info Raw:', extractedInfoRaw);
  // more lines to our function
    let extractedData = null;
    if (extractedInfoRaw) {
        try {
            extractedData = JSON.parse(extractedInfoRaw);
        } catch (jsonError) {
            console.error("Failed to parse JSON from Hugging Face response:", jsonError);
            extractedData = { error: "Hugging Face returned malformed JSON", rawResponse: extractedInfoRaw };
        }
    } else {
        console.warn('Hugging Face text extraction failed or returned no data.');
        extractedData = { error: "Hugging Face extraction returned no data." };
    }

    // THIS IS THE NEW FINAL RESPONSE:
    // res.json({
    //     success: true, // Indicate success explicitly
    //     ocrText: parsedText,
    //     extractedData: extractedData
    // });
    //console.log('Final response sent:', extractedData );

try {
    const newColis = new Colis({
        nom: extractedData.nom || undefined,
        prenom: extractedData.prenom || undefined,
        trackingNumber: extractedData.trackingNumber || undefined,
        transporteur: extractedData.transporteur || undefined,
        phone: extractedData.telephone || undefined,
        poids: extractedData.poids || undefined,
        date: extractedData.date || undefined,
        extractedFromOCR: extractedData || undefined,// Save the cleaned extracted object as a whole too
    });

    await newColis.save();
    console.log('Colis saved successfully to DB:', newColis);


    // Final response to frontend (including db success)
        res.json({
            success: true,
            ocrText: parsedText,
            extractedData: extractedData, // This is the cleaned data
            dbStatus: 'Colis saved successfully',
            colisId: newColis._id 
        });

} catch (dbError) {
    console.error('Error saving/updating Colis to DB:', dbError);
    res.status(500).json({
        success: false,
        message: 'Internal server error: Failed to save Colis to database.',
        errorDetails: dbError.message,
        ocrText: parsedText,
        extractedData: extractedData
    });
}
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// PUT route to update a Colis document by its ID
// This route allows updating specific fields of a Colis document identified by its _id.
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the document ID from the URL (e.g., /colis/6846b9836cb8f9a2660ef23f)
        const updates = req.body; // Get the updated data from the request body (e.g., { nom: "New Nom", phone: "123" })

        // Optional: Data cleaning for phone, poids, date before saving
        if (updates.phone) {
            // Ensure phone is a string and clean non-digits
            updates.phone = String(updates.phone).replace(/\D/g, '');
        }
        if (updates.poids) {
            // Convert poids to a number if it's sent as a string from frontend input
            updates.poids = parseFloat(updates.poids);
            if (isNaN(updates.poids)) { // Handle cases where parseFloat results in NaN
                delete updates.poids; // Don't try to save NaN
            }
        }
        if (updates.date) {
            // Convert date string (e.g., YYYY-MM-DD) to a Date object
            const parsedDate = new Date(updates.date);
            if (!isNaN(parsedDate.getTime())) { // Check if date is valid
                updates.date = parsedDate;
            } else {
                delete updates.date; // Don't try to save invalid date
            }
        }
        // End optional cleaning

        // Find the document by its _id and update it with the provided fields.
        // { new: true } makes findByIdAndUpdate return the *updated* document.
        // { runValidators: true } ensures Mongoose schema validations (like type checking) run on updates.
        const updatedColis = await Colis.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });

        if (!updatedColis) {
            
            return res.status(404).json({ success: false, message: 'Colis not found for update.' });
        }


        res.json({ success: true, message: 'Colis updated successfully!', colis: updatedColis });

    } catch (error) {
        console.error('Error updating Colis document:', error);

        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal server error during Colis update.', errorDetails: error.message });
        }
    }
});

//route get pour récupérer tous les colis et les afficher dans le stock colis côté pro
router.get('/', async (req, res) => {
  const stock = await Colis.find(); 
      res.json({ result: true, stock });
  });
  
  // Route GET pour les stat colis scannés
router.get('/stats', async (req, res) => {
  const { range } = req.query; // 'semaine', 'mois', 'annee'
    const colis = await Colis.find();
    const grouped = groupByPeriod(colis, 'createdAt', range);
    const bestScore = Math.max(...grouped);
    res.json({ result: true, data: grouped, best: bestScore });
});


module.exports = router;



// snippet to add when we implement the python script
    // Call Python script
    // const python = spawn('python', ['../routes/nlp/extract_info.py']); 

    // let output = '';
    // python.stdout.on('data', (data) => {
    //   output += data.toString();
    // });

    // python.stdin.write(parsedText);
    // python.stdin.end();

    // python.on('close', (code) => {
    //   const info = JSON.parse(output);
    //   res.json({
    //     text: parsedText,
    //     extracted: info,
    //   });
    // });