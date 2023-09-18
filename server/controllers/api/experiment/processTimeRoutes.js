const router = require('express').Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../../../config/connection');
const { ExperimentProcessTime, ProcessTime } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentProcessTime.findAll()
        .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentProcessTime.findAll({
        where: {
            experiment_id: req.params.id
        },
        // order: [
        //     [ProcessTime, 'process_time', 'ASC']
        // ],
        include: [{
            model: ProcessTime
        }]
    })
        .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentProcessTime.update(req.body, {
        where: {
            experiment_site_id: req.params.id
        }
    })
        .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;