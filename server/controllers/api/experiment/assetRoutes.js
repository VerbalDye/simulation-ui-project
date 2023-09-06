const router = require('express').Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../../../config/connection');
const { ExperimentAsset, Asset, OperationToLocation, Operation, ExperimentOpToLoc, ExperimentRouting, Routing, ExperimentProcessTime, ProcessTime } = require('../../../models');

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

router.get('/:id', (req, res) => {
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
                {
                    model: Asset,
                    through: {
                        where: {
                            travel_allowed: true
                        }
                    },
                    as: 'destinations',
                    include: [{
                        model: Asset,
                        through: {
                            where: {
                                travel_allowed: true
                            }
                        },
                        as: 'destinations'
                    }]
                }
                // {
                //     model: Routing,
                //     as: 'origin',
                //     attributes: ['routing_id', 'origin', 'destination', 'travel_allowed'],
                //     where: {
                //         travel_allowed: true
                //     },
                //     include: [{
                //         model: Asset,
                //         where: {
                //             destination: 'asset_id'
                //         }
                //         // as: 'origin'
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

router.put('/bulk/:id', (req, res) => {
    req.body.data.forEach(target_asset => {
        let { asset_id, created, last_modified, is_default, destinations, operation_to_locations, ...asset } = { ...target_asset };
        delete asset.asset_id;
        Asset.findOne({
            where: {
                asset_name: asset.asset_name,
                is_default: true
            }
        })
            .then(dbAssetData => {
                if (dbAssetData) {
                    let changeKeys = Object.keys(asset).filter(key => asset[key] == "RESET");
                    changeKeys.forEach(key => {
                        asset[key] = dbAssetData[key];
                    });
                } else {
                    res.status(400).json({ message: "Can't reset entry" });
                }
                if (is_default) {
                    console.log(asset);
                    Asset.create(asset)
                        .then(dbNewAssetData => {
                            Promise.allSettled([
                                new Promise(function (resolve) {
                                    OperationToLocation.findAll({
                                        where: {
                                            asset_id: target_asset.asset_id
                                        },
                                        include: [{
                                            model: ExperimentOpToLoc,
                                            where: {
                                                experiment_id: req.params.id
                                            }
                                        }]
                                    })
                                        .then(dbOperationToLocationData => {
                                            dbOperationToLocationData.forEach(entry => {
                                                let { operation_to_location_id, experiment_op_to_locs, is_default, created, last_modified, ...rest } = { ...entry.dataValues }
                                                rest.asset_id = dbNewAssetData.asset_id
                                                OperationToLocation.create(rest)
                                                    .then(dbOpToLocData => {
                                                        ExperimentOpToLoc.update(
                                                            {
                                                                operation_to_location_id: dbOpToLocData.operation_to_location_id
                                                            },
                                                            {
                                                                where: {
                                                                    experiment_id: req.params.id,
                                                                    operation_to_location_id: operation_to_location_id
                                                                }
                                                            }
                                                        )
                                                    })
                                            })
                                            resolve();
                                        })
                                }),
                                new Promise(function (resolve) {
                                    Routing.findAll({
                                        where: {
                                            travel_allowed: true,
                                            [Sequelize.Op.or]:
                                                [
                                                    { origin: target_asset.asset_id },
                                                    { destination: target_asset.asset_id },
                                                ]
                                        },
                                        include: [{
                                            model: ExperimentRouting,
                                            where: {
                                                experiment_id: req.params.id
                                            }
                                        }]
                                    })
                                        .then(dbRoutingData => {
                                            console.log(dbRoutingData.map(e => e.dataValues));
                                            dbRoutingData.forEach(entry => {
                                                let { routing_id, experiment_routings, is_default, created, last_modified, ...rest } = { ...entry.dataValues }
                                                if (rest.origin == target_asset.asset_id) {
                                                    rest.origin = dbNewAssetData.asset_id
                                                }
                                                if (rest.destination == target_asset.asset_id) {
                                                    rest.destination = dbNewAssetData.asset_id
                                                }
                                                Routing.create(rest)
                                                    .then(dbNewRoutingData => {
                                                        ExperimentRouting.update(
                                                            {
                                                                routing_id: dbNewRoutingData.routing_id
                                                            },
                                                            {
                                                                where: {
                                                                    experiment_id: req.params.id,
                                                                    routing_id: routing_id
                                                                }
                                                            }
                                                        )
                                                    })
                                            })
                                            resolve();
                                        })
                                }),
                                new Promise(function (resolve) {
                                    ProcessTime.findAll({
                                        where: {
                                            asset_id: target_asset.asset_id
                                        },
                                        include: [{
                                            model: ExperimentProcessTime,
                                            where: {
                                                experiment_id: req.params.id
                                            }
                                        }]
                                    })
                                        .then(dbProcessTimeData => {
                                            dbProcessTimeData.forEach(entry => {
                                                let { process_time_id, experiment_op_to_locs, is_default, created, last_modified, ...rest } = { ...entry.dataValues }
                                                rest.asset_id = dbNewAssetData.asset_id
                                                ProcessTime.create(rest)
                                                    .then(dbNewProcessTimeData => {
                                                        ExperimentProcessTime.update(
                                                            {
                                                                process_time_id: dbNewProcessTimeData.process_time_id
                                                            },
                                                            {
                                                                where: {
                                                                    experiment_id: req.params.id,
                                                                    process_time_id: process_time_id
                                                                }
                                                            }
                                                        )
                                                    })
                                            })
                                            resolve();
                                        })
                                }),
                            ])
                                .then(dbPromiseData => {
                                    console.log(`!!\n!!\n!!\n!!\n!!\n!!\n!!\n!!\n!!\n!!\n!!\n`)
                                    ExperimentAsset.update({
                                        asset_id: dbNewAssetData.asset_id
                                    }, {
                                        where: {
                                            experiment_id: req.params.id,
                                            asset_id: target_asset.asset_id
                                        }
                                    })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(400).json(err);
                                        });
                                })
                        })
                } else {
                    Asset.update(
                        {
                            capacity: 0
                        }
                        , {
                            where: {
                                asset_id: target_asset.asset_id
                            }
                        }
                    )
                        .catch(err => {
                            console.log(err);
                            res.status(400).json(err);
                        });
                }
            })
    })
    res.status(200).json({ message: 'Success' })
})

module.exports = router;