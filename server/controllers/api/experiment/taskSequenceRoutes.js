const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentTaskSequence, TaskSequence, Phases, Cell, Operation } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentTaskSequence.findAll()
        .then(dbExperimentTaskSequenceData => res.json(dbExperimentTaskSequenceData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentTaskSequence.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: TaskSequence,
            include: [
                { model: Phases },
                { model: Cell },
                { model: Operation }
            ]
        }]
    })
        .then(dbExperimentTaskSequenceData => res.json(dbExperimentTaskSequenceData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/bulk/:id', (req, res) => {
    ExperimentTaskSequence.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentTaskSequenceData => {
            let bulkData = dbExperimentTaskSequenceData.map(e => {
                let object = {};
                object.experiment_id = e.experiment_id;
                object.iteration_number = req.body.iteration_number
                object.task_sequence_id = e.task_sequence_id
                return object;
            })
            ExperimentTaskSequence.bulkCreate(bulkData)
                .then(dbNewExperimentTaskSequenceData => res.json(dbNewExperimentTaskSequenceData))
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentTaskSequence.update(req.body, {
        where: {
            experiment_task_sequence_id: req.params.id
        }
    })
        .then(dbExperimentTaskSequenceData => res.json(dbExperimentTaskSequenceData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;