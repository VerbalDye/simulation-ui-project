const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentShift, Shift } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentShift.findAll()
        .then(dbExperimentShiftData => res.json(dbExperimentShiftData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentShift.findAll({
        where: {
            experiment_id: req.params.id
        },
        // order: [
        //     [Shift, 'process_time', 'ASC']
        // ],
        include: [{
            model: Shift
        }]
    })
        .then(dbExperimentShiftData => res.json(dbExperimentShiftData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;