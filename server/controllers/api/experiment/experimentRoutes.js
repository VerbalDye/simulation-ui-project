const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { copyFromModel } = require('../../../utils/sqlMethods');
const {
    Asset,
    Downtime,
    Experiment,
    ExperimentAsset,
    ExperimentCore,
    ExperimentCoreSoakTime,
    ExperimentDowntime,
    ExperimentHoo,
    ExperimentJobMix,
    ExperimentOpToLoc,
    ExperimentPriority,
    ExperimentProcessTime,
    ExperimentRouting,
    ExperimentShift,
    ExperimentSite,
    ExperimentSkills,
    ExperimentTaskSequence,
    ExperimentTimeDistribution,
    ExperimentTimeType,
    ExperimentWorker,
    ExperimentWorkerShift,
    JobList,
    Log,
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
        include: [
            {
                model: Users,
                attributes: ['email', 'first_name', 'last_name'],
            },
            {
                model: Scenario
            }
        ]
    })
        .then(dbExperimentData => {
            res.json(dbExperimentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/log/:id', (req, res) => {
    Log.findOne({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbLogData => res.json(dbLogData))
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
    console.log(id, b.targetIteration);
    let dbRoutingData = await Routing.findAll({
        where: { travel_allowed: true },
        include: [{ model: ExperimentRouting, where: { experiment_id: id, iteration_number: b.targetIteration } }]
    });
    let dbExperimentTaskSequenceData = await ExperimentTaskSequence.findAll({ where: { experiment_id: id, iteration_number: b.targetIteration } });
    // Clear Data for Iteration

    let deleteResults = await Promise.allSettled([
        sequelize.query("DELETE asset FROM asset INNER JOIN experiment_asset ON asset.asset_id = experiment_asset.asset_id WHERE experiment_asset.experiment_id = 15 AND experiment_asset.iteration_number = 1 AND asset.is_default = 0",
            { replacements: { expId: id, iteration: b.iteration } }),
        ExperimentAsset.destroy({
            where: { experiment_id: id, iteration_number: b.iteration }
        }),
        sequelize.query("DELETE process_time FROM process_time INNER JOIN experiment_process_time ON process_time.process_time_id = experiment_process_time.process_time_id WHERE experiment_process_time.experiment_id = :expId AND experiment_process_time.iteration_number = :iteration",
            { replacements: { expId: id, iteration: b.iteration } }),
        sequelize.query("DELETE operation_to_location FROM operation_to_location INNER JOIN experiment_op_to_loc ON operation_to_location.operation_to_location_id = experiment_op_to_loc.operation_to_location_id WHERE experiment_op_to_loc.experiment_id = :expId AND experiment_op_to_loc.iteration_number = :iteration",
            { replacements: { expId: id, iteration: b.iteration } }),
        sequelize.query("DELETE routing FROM routing INNER JOIN experiment_routing ON routing.routing_id = experiment_routing.routing_id WHERE experiment_routing.experiment_id = :expId AND experiment_routing.iteration_number = :iteration",
            { replacements: { expId: id, iteration: b.iteration } }),
        ExperimentTaskSequence.destroy({
            where: { experiment_id: id, iteration_number: b.iteration }
        }),
        sequelize.query("DELETE asset_downtime FROM asset_downtime INNER JOIN experiment_asset_downtime ON asset_downtime.asset_downtime_id = experiment_asset_downtime.asset_downtime_id WHERE experiment_asset_downtime.experiment_id = :expId AND experiment_asset_downtime.iteration_number = :iteration",
            { replacements: { expId: id, iteration: b.iteration } }),
        ExperimentDowntime.destroy({
            where: { experiment_id: id, iteration_number: b.iteration }
        })
    ])
    console.log(deleteResults[0]);
    // Get Asset Data 
    let assetData = b.data.asset.filter(e => e.capacity == 0 || e.capacity == "RESET");
    assetData = assetData.map(e => {
        let obj = { ...e };
        if (obj.capacity == "RESET") {
            obj.capacity = dbDefaultAssetData.find(e => e.asset_name == obj.asset_name).capacity;
        }
        return obj;
    })
    let bulkAssetData = assetData.map(({ asset_id, ...rest }) => rest)
    let dbAssetData = await Asset.bulkCreate(bulkAssetData);
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
    let dbDowntimeData = await Downtime.bulkCreate(b.data.downtime);
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
    let experimentDowntimeData = dbDowntimeData.map(e => {
        let obj = {};
        obj.experiment_id = id;
        obj.iteration_number = b.iteration;
        obj.asset_downtime_id = e.asset_downtime_id;
        return obj;
    })
    await Promise.allSettled([
        ExperimentAsset.bulkCreate(experimentAssetData),
        ExperimentOpToLoc.bulkCreate(experimentOperationToLocationData),
        ExperimentProcessTime.bulkCreate(experimentProcessTimeData),
        ExperimentRouting.bulkCreate(experimentRoutingData),
        ExperimentTaskSequence.bulkCreate(experimentTaskSequenceData),
        ExperimentDowntime.bulkCreate(experimentDowntimeData)
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
                    model: ExperimentPriority,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'priority_id']
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
                    model: ExperimentShift,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'shift_id']
                },
                {
                    model: ExperimentSite,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['site_id']
                },
                {
                    model: ExperimentSkills,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'skills_id']
                },
                {
                    model: ExperimentTaskSequence,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'task_sequence_id']
                },
                {
                    model: ExperimentTimeDistribution,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'process_time_distribution_id']
                },
                {
                    model: ExperimentTimeType,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: [
                        'iteration_number',
                        'asset_id',
                        'operation_id',
                        'discrete'
                    ]
                },
                {
                    model: ExperimentWorker,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'worker_id']
                },
                {
                    model: ExperimentWorkerShift,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['iteration_number', 'worker_shift_id']
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
                {
                    model: ExperimentCore,
                    foreignKey: { experiment_id: req.params.id },
                    attributes: ['core_number', 'available']
                }
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