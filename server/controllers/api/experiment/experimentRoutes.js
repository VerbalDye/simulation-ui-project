const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { copyFromModel } = require('../../../utils/sqlMethods');
const {
    Asset,
    CurrentlyRunning,
    Experiment,
    ExperimentAsset,
    ExperimentCoreSoakTime,
    ExperimentHoo,
    ExperimentJobMix,
    ExperimentOpToLoc,
    ExperimentProcessTime,
    ExperimentRouting,
    ExperimentSite,
    ExperimentTaskSequence,
    JobList,
    OperationToLocation,
    ProcessTime,
    Routing,
    Scenario,
    ScenarioFilter,
    Sessions,
    Site,
    Users,
    TaskSequence
} = require('../../../models');

router.get('/', (req, res) => {
    Experiment.findAll({
        include: [
            {
                model: Users,
                attributes: ['email', 'first_name', 'last_name'],
                // as: ['user_email', 'user_first_name', 'user_last_name']
                // [sequelize.literal("(SELECT RTRIM(LTRIM(CONCAT(COALESCE(first_name + ' ', ''), COALESCE(last_name, '')))) AS Name)")]
            }
        ]
    })
        .then(dbExperimentData => res.json(dbExperimentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/user/:id', (req, res) => {
    Experiment.findAll({
        where: {
            user_id: req.params.id
        },
        include: [{
            model: Users,
            attributes: ['email', 'first_name', 'last_name'],
        }]
    })
        .then(dbExperimentData => {
            res.json(dbExperimentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/running/:id', (req, res) => {
    CurrentlyRunning.findOne({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentData => {
            if (dbExperimentData) {
                res.json({ running: true, started: dbExperimentData.started })
            } else {
                res.json({ running: false })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.get('/:id', (req, res) => {
    Experiment.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [
            {
                model: ExperimentSite,
                include: [{
                    model: Site
                }]
            },
            {
                model: Scenario,
                include: [{
                    model: ScenarioFilter
                }]
            },
            {
                model: Users,
                attributes: {
                    exclude: ['password']
                }
            }
        ]
    })
        .then(dbExperimentData => {
            if (!dbExperimentData[0]) {
                res.status(404).json({ message: 'No experiment found with this ID' });
                return;
            }
            res.json(dbExperimentData[0]);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    Experiment.create({
        name: req.body.name,
        option1: req.body.option1,
        // change to user making request in future
        created_by: req.body.created_by
    })
        .then(dbExperimentData => {
            if (!dbExperimentData[0]) {
                res.status(400).json({ message: 'Something went wrong. Check submitted values and try again.' });
                return;
            }
            res.json(dbExperimentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/inputs/:id', async (req, res) => {
    const b = req.body;
    const id = req.params.id;
    // Get Initial Data
    let dbDefaultAssetData = await Asset.findAll({ where: { is_default: true } });
    let dbOperationToLocationData = await OperationToLocation.findAll({
        include: [{ model: ExperimentOpToLoc, where: { experiment_id: id, iteration_number: b.targetIteration } }]
    });
    let dbRoutingData = await Routing.findAll({
        where: { travel_allowed: true },
        include: [{ model: ExperimentRouting, where: { experiment_id: id, iteration_number: b.targetIteration } }]
    });
    let dbExperimentTaskSequenceData = await ExperimentTaskSequence.findAll({ where: { experiment_id: id, iteration_number: b.targetIteration } });
    // Clear Data for Iteration
    await Promise.allSettled([
        Asset.destroy({
            where: { is_default: false },
            include: [{ model: ExperimentAsset, where: { experiment_id: id, iteration_number: b.iteration } }]
        }),
        ExperimentAsset.destroy({
            where: { experiment_id: id, iteration_number: b.iteration }
        }),
        ProcessTime.destroy({
            where: { is_default: false },
            include: [{ model: ExperimentProcessTime, where: { experiment_id: id, iteration_number: b.iteration } }]
        }),
        OperationToLocation.destroy({
            where: { is_default: false },
            include: [{ model: ExperimentOpToLoc, where: { experiment_id: id, iteration_number: b.iteration } }]
        }),
        Routing.destroy({
            where: { is_default: false },
            include: [{ model: ExperimentRouting, where: { experiment_id: id, iteration_number: b.iteration } }]
        }),
        ExperimentTaskSequence.destroy({
            where: { experiment_id: id, iteration_number: b.iteration }
        })
    ])
    // Get Asset Data 
    let assetData = b.data.asset.filter(e => e.capacity == 0 || e.capacity == "RESET");
    assetData = assetData.map(e => {
        let obj = { ...e };
        if (obj.capacity == "RESET") {
            obj.capacity = dbDefaultAssetData.find(e => e.asset_name == obj.asset_name).capacity;
        }
        return obj;
    })
    let dbAssetData = await Asset.bulkCreate(assetData.map(({ asset_id, ...rest }) => rest));
    // Asset Substitution
    let assetIdTable = {};
    dbAssetData.forEach((asset, index) => {
        assetIdTable[assetData[index].asset_id] = asset.asset_id;
    })
    let processTimeData = b.data.process_time.map(e => {
        let obj = { ...e };
        if (assetIdTable[obj.asset_id]) {
            obj.asset_id = assetIdTable[obj.asset_id];
        }
        return obj;
    })
    let opToLocData = dbOperationToLocationData.map(e => {
        let obj = {};
        obj.operation_id = e.operation_id;
        if (assetIdTable[e.asset_id]) {
            obj.asset_id = assetIdTable[e.asset_id];
        } else {
            obj.asset_id = e.asset_id
        }
        return obj;
    })
    let routingData = dbRoutingData.map(e => {
        let obj = {};
        if (assetIdTable[e.origin]) {
            obj.origin = assetIdTable[e.origin];
        } else {
            obj.origin = e.origin;
        }
        if (assetIdTable[e.destination]) {
            obj.destination = assetIdTable[e.destination];
        } else {
            obj.destination = e.destination;
        }
        obj.travel_allowed = e.travel_allowed;
        obj.transportation_class = obj.transportation_class;
        return obj;
    });

    let dbProcessTimeData = await ProcessTime.bulkCreate(processTimeData);
    let dbNewOperationToLocationData = await OperationToLocation.bulkCreate(opToLocData);
    let dbNewRoutingData = await Routing.bulkCreate(routingData);
    //Experiment Data Creation
    let experimentAssetData = b.data.asset.map(e => {
        let obj = {};
        obj.iteration_number = b.iteration;
        obj.experiment_id = id;
        if (assetIdTable[e.asset_id]) {
            obj.asset_id = assetIdTable[e.asset_id];
        } else {
            obj.asset_id = e.asset_id
        }
        return obj;
    })
    let experimentOperationToLocationData = dbNewOperationToLocationData.map(e => {
        let obj = {};
        obj.iteration_number = b.iteration;
        obj.experiment_id = id;
        obj.operation_to_location_id = e.operation_to_location_id
        return obj;
    })
    let experimentProcessTimeData = dbProcessTimeData.map(e => {
        let obj = {};
        obj.iteration_number = b.iteration;
        obj.experiment_id = id;
        obj.process_time_id = e.process_time_id
        return obj;
    })
    let experimentRoutingData = dbNewRoutingData.map(e => {
        let obj = {};
        obj.iteration_number = b.iteration;
        obj.experiment_id = id;
        obj.routing_id = e.routing_id
        return obj;
    });
    let experimentTaskSequenceData = dbExperimentTaskSequenceData.map(e => {
        let obj = {};
        obj.experiment_id = e.experiment_id;
        obj.task_sequence_id = e.task_sequence_id;
        obj.iteration_number = b.iteration;
        return obj;
    })
    await Promise.allSettled([
        ExperimentAsset.bulkCreate(experimentAssetData),
        ExperimentOpToLoc.bulkCreate(experimentOperationToLocationData),
        ExperimentProcessTime.bulkCreate(experimentProcessTimeData),
        ExperimentRouting.bulkCreate(experimentRoutingData),
        ExperimentTaskSequence.bulkCreate(experimentTaskSequenceData)
    ])
    res.json({ message: "Success" });
})

router.post('/from/:id', (req, res) => {
    Sessions.findOne({
        where: {
            session_token: req.cookies.session_token
        }
    }).then(async dbSessionData => {
        let target = {
            model: Experiment,
            primaryKey: { experiment_id: req.params.id },
            changes: { user_id: dbSessionData.user_id, experiment_name: "Experiment " + Math.floor(Math.random() * 10000000000) },
            attributes: ['scenario_id'],
            associations: [
                {
                    model: ExperimentAsset,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'asset_id']
                },
                {
                    model: ExperimentCoreSoakTime,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'core_soak_time_id']
                },
                {
                    model: ExperimentHoo,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'hours_of_operation_id']
                },
                {
                    model: ExperimentJobMix,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'job_mix_id']
                },
                {
                    model: ExperimentOpToLoc,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'operation_to_location_id']
                },
                {
                    model: ExperimentProcessTime,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'process_time_id']
                },
                {
                    model: ExperimentRouting,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'routing_id']
                },
                {
                    model: ExperimentSite,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['site_id']
                },
                {
                    model: ExperimentTaskSequence,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'task_sequence_id']
                },
                {
                    model: JobList,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: [
                        "job_number",
                        "iteration_number",
                        "model_number",
                        "replication",
                        "job_mix_id",
                        "start",
                        "current_task",
                        "need_transit",
                        "transit_type",
                        "resource_type",
                        "next_task",
                        "resource_keep",
                        "qc_pass"
                    ]
                },
            ]
        }
        let experimentData = await copyFromModel(target);
        res.json(experimentData);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// router.post('/from/:id', (req, res) => {
//     Experiment.findOne({
//         where: {
//             experiment_id: req.params.id
//         }
//     })
//         .then(dbFromExperimentData => {
//             Sessions.findOne({
//                 where: {
//                     session_token: req.cookies.session_token
//                 }
//             }).then(dbSessionData => {
//                 Experiment.create({
//                     experiment_name: dbFromExperimentData.experiment_name + Math.floor(Math.random() * 1000),
//                     scenario_id: dbFromExperimentData.scenario_id,
//                     user_id: dbSessionData.user_id
//                 })
//                     .then(dbExperimentData => {
//                         Promise.allSettled([
//                             new Promise(resolve => {
//                                 ExperimentAsset.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentAssetData => {
//                                         let updates = [];
//                                         for (item of dbExperimentAssetData) {
//                                             updates.push(
//                                                 ExperimentAsset.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     iteration_number: item.iteration_number,
//                                                     asset_id: item.asset_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentCoreSoakTime.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentCoreSoakTimeData => {
//                                         let updates = [];
//                                         for (item of dbExperimentCoreSoakTimeData) {
//                                             await ExperimentCoreSoakTime.create({
//                                                 experiment_id: dbExperimentData.experiment_id,
//                                                 iteration_number: item.iteration_number,
//                                                 core_soak_time_id: item.core_soak_time_id
//                                             })
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 JobList.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbJobListData => {
//                                         let updates = [];
//                                         for (item of dbJobListData) {
//                                             await JobList.create({
//                                                 experiment_id: dbExperimentData.experiment_id,
//                                                 job_number: item.job_number,
//                                                 iteration_number: item.iteration_number,
//                                                 model_number: item.model_number,
//                                                 job_mix_id: item.job_mix_id,
//                                                 start: item.start,
//                                                 current_task: item.current_task,
//                                                 need_transit: item.need_transit,
//                                                 transit_type: item.transit_type,
//                                                 resource_type: item.resource_type,
//                                                 next_type: item.next_type,
//                                                 resource_keep: item.resource,
//                                                 qc_pass: item.qc_pass
//                                             })
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentHoo.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentHooData => {
//                                         let updates = []
//                                         for (item of dbExperimentHooData) {
//                                             updates.push(
//                                                 ExperimentHoo.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     iteration_number: item.iteration_number,
//                                                     hours_of_operation_id: item.hours_of_operation_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentJobMix.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentJobMixData => {
//                                         let updates = [];
//                                         for (item of dbExperimentJobMixData) {
//                                             updates.push(
//                                                 ExperimentJobMix.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     iteration_number: item.iteration_number,
//                                                     job_mix_id: item.job_mix_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentOpToLoc.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentOpToLocData => {
//                                         let updates = [];
//                                         for (item of dbExperimentOpToLocData) {
//                                             updates.push(
//                                                 ExperimentOpToLoc.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     iteration_number: item.iteration_number,
//                                                     operation_to_location_id: item.operation_to_location_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentProcessTime.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentProcessTimeData => {
//                                         let updates = [];
//                                         for (item of dbExperimentProcessTimeData) {
//                                             updates.push(
//                                                 ExperimentProcessTime.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     iteration_number: item.iteration_number,
//                                                     process_time_id: item.process_time_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentRouting.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentRoutingData => {
//                                         let updates = [];
//                                         for (item of dbExperimentRoutingData) {
//                                             updates.push(
//                                                 ExperimentRouting.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     iteration_number: item.iteration_number,
//                                                     routing_id: item.routing_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentSite.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentSiteData => {
//                                         let updates = [];
//                                         for (item of dbExperimentSiteData) {
//                                             updates.push(
//                                                 ExperimentSite.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     site_id: item.site_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             }),
//                             new Promise(resolve => {
//                                 ExperimentTaskSequence.findAll({
//                                     where: {
//                                         experiment_id: req.params.id
//                                     }
//                                 })
//                                     .then(async dbExperimentTaskSequenceData => {
//                                         let updates = [];
//                                         for (item of dbExperimentTaskSequenceData) {
//                                             updates.push(
//                                                 ExperimentTaskSequence.create({
//                                                     experiment_id: dbExperimentData.experiment_id,
//                                                     iteration_number: item.iteration_number,
//                                                     task_sequence_id: item.task_sequence_id
//                                                 })
//                                             )
//                                         }
//                                         await Promise.allSettled(updates);
//                                         resolve();
//                                     })
//                             })
//                         ])
//                             .then(promiseResponse => {
//                                 res.json(dbExperimentData);
//                             })
//                     })
//             })
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

router.put('/:id', (req, res) => {
    Experiment.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentData => {
            if (!dbExperimentData) {
                res.status(404).json({ message: 'No experiment found with this ID' });
                return;
            }
            res.json(dbExperimentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Experiment.destroy({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentData => {
            res.status(204).end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;