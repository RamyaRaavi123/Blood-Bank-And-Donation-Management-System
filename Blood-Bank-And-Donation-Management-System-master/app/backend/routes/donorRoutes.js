const express = require('express');
const { createDonor, getDonors } = require('../controllers/donorController');
const router = express.Router();

router.post('/', createDonor);

router.get('/', (req, res, next) => {
    const isAdmin = req.headers.authorization === 'Bearer admin123';
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });
    next();
}, getDonors);

module.exports = router;
