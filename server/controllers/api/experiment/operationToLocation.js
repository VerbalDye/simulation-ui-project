const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentOpToLoc, OperationToLocation, Operation, Asset } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentOpToLoc.findAll()
        .then(dbExperimentOperationToLocationData => res.json(dbExperimentOperationToLocationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentOpToLoc.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: OperationToLocation,
            include: [
                { model: Operation },
                { model: Asset }
            ]
        }]
    })
        .then(dbExperimentOperationToLocationData => res.json(dbExperimentOperationToLocationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentOpToLoc.update(req.body, {
        where: {
            experiment_op_to_loc_id: req.params.id
        }
    })
        .then(dbExperimentOperationToLocationData => res.json(dbExperimentOperationToLocationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;