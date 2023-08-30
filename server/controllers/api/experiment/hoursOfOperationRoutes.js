const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentHoo, HoursOfOperation } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentHoo.findAll()
        .then(dbExperimentHooData => res.json(dbExperimentHooData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentHoo.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: HoursOfOperation
        }]
    })
        .then(dbExperimentHooData => res.json(dbExperimentHooData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentHoo.update(req.body, {
        where: {
            experiment_hoo_id: req.params.id
        }
    })
        .then(dbExperimentHooData => res.json(dbExperimentHooData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;