const express = require('express');
const router = express.Router();

// route vide pour tester 
router.get('/', (req, res) => {
  res.send('Route pros OK');
});

module.exports = router;
