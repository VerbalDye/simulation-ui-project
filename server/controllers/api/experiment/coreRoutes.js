const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentCore, Core, CoreModel } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentCore.findAll()
        .then(dbExperimentCoreData => res.json(dbExperimentCoreData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentCore.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: Core,
            include: [{
                model: CoreModel
            }],
        }]
    })
        .then(dbExperimentCoreData => res.json(dbExperimentCoreData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/bulk/:id', (req, res) => {
    let promises = []
    req.body.data.forEach(entry => {
        promises.push(
            ExperimentCore.update({ available: entry.available }, {
                where: {
                    experiment_core_id: entry.experiment_core_id
                }
            })
        )
    })
    Promise.allSettled(promises)
        .then(dbExperimentCoreData => res.json(dbExperimentCoreData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentCore.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentCoreData => res.json(dbExperimentCoreData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;