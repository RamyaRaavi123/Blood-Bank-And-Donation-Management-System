const Donor = require('../models/Donor');

exports.createDonor = async (req, res) => {
    const donor = new Donor(req.body);
    try {
        await donor.save();
        res.status(201).json({ message: 'Donation recorded!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDonors = async (req, res) => {
    try {
        const donors = await Donor.find();
        res.status(200).json(donors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
