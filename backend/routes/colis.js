const express = require('express');
const router = express.Router();
const Colis = require('../models/colis');







// Route 1 : recherche par tracking number
router.get('/:trackingNumber', async (req, res) => {
    const colis = await Colis.findOne({ trackingNumber: req.params.trackingNumber });

    if (colis) {
        res.json({ found: true, colis, message: 'Colis bien livré' });
    } else {
        res.status(404).json({ message: 'Colis pas encore arrivé' });
    }

});

//  Route 2 : recherche par nom et prénom 
router.post('/:name', async (req, res) => {
  const { nom, prenom } = req.body;


    const colis = await Colis.find({ nom, prenom }); // on peut renvoyer plusieurs colis !

    if (colis.length > 0) {
      res.json({ found: true, colis, message: 'Colis trouvés' });
    } else {
      res.status(404).json({ found: false, message: 'Aucun colis à ce nom' });
    }

  
});
module.exports = router;