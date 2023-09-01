const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentJobMix, JobMix } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentJobMix.findAll()
        .then(dbExperimentJobMixData => res.json(dbExperimentJobMixData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentJobMix.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: {
            model: JobMix
        }
    })
        .then(dbExperimentJobMixData => res.json(dbExperimentJobMixData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentJobMix.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentJobMixData => res.json(dbExperimentJobMixData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;