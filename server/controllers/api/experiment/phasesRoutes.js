const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentPhases, Phases, Cell, Operation } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentPhases.findAll()
        .then(dbExperimentPhasesData => res.json(dbExperimentPhasesData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentPhases.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{ model: Phases }]
    })
        .then(dbExperimentPhasesData => res.json(dbExperimentPhasesData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentPhases.update(req.body, {
        where: {
            experiment_phases_id: req.params.id
        }
    })
        .then(dbExperimentPhasesData => res.json(dbExperimentPhasesData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;