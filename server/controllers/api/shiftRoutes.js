const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Shift } = require('../../models');

router.get('/', (req, res) => {
    Shift.findAll()
        .then(dbShiftData => res.json(dbShiftData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;