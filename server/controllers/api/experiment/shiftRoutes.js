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

router.post('/:id', (req, res) => {
    Shift.create({
        crew: req.body.crew,
        begin: req.body.begin,
        end: req.body.end,
        is_default: false
    }).then(dbShiftData => {
        ExperimentShift.create({
            shift_id: dbShiftData.shift_id,
            experiment_id: req.params.id,
            iteration_number: 0,
        }).then(dbExperimentShiftData => res.json(dbExperimentShiftData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    })
});

module.exports = router;