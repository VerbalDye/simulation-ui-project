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

router.post('/', (req, res) => {
    Shift.create({
        crew: req.body.crew,
        begin: req.body.begin,
        end: req.body.end,
        default: 1
    })
        .then(dbShiftData => {
            res.json(dbShiftData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;