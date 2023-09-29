const router = require('express').Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../../../config/connection');
const { ExperimentAsset, Asset, OperationToLocation, Operation, ExperimentOpToLoc, ExperimentRouting, Routing, ExperimentProcessTime, ProcessTime } = require('../../../models');
const { copyFromMany } = require('../../../utils/sqlMethods');

router.get('/', (req, res) => {
    ExperimentAsset.findAll({
        include: [
            {
                model: Asset
            }
        ]
    })
        .then(dbExperimentAssetData => res.json(dbExperimentAssetData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/with-op-to-loc/:id', (req, res) => {
    ExperimentAsset.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: Asset,
            include: [
                {
                    model: OperationToLocation,
                    include: [
                        {
                            model: Operation
                        },
                        {
                            model: ExperimentOpToLoc,
                            where: { experiment_id: req.params.id },
                            required: true
                        }
                    ]
                },
                // {
                //     model: Asset,
                //     through: {
                //         where: {
                //             travel_allowed: true
                //         }
                //     },
                //     as: 'destinations',
                //     include: [{
                //         model: Asset,
                //         through: {
                //             where: {
                //                 travel_allowed: true
                //             }
                //         },
                //         as: 'destinations'
                //     }]
                // }
            ]
        }]
    })
        .then(dbExperimentAssetData => res.json(dbExperimentAssetData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentAsset.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [
            {
                model: Asset
            }
        ]
    })
        .then(dbExperimentAssetData => res.json(dbExperimentAssetData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentAsset.update(req.body, {
        where: {
            experiment_asset_id: req.params.id
        }
    })
        .then(dbExperimentAssetData => res.json(dbExperimentAssetData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;