const router = require('express').Router();
const sequelize = require('../../../config/connection');
const {
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
    Scenario,
    ScenarioFilter,
    Sessions,
    Site,
    Users
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

router.post('/from/:id', (req, res) => {
    Experiment.findOne({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbFromExperimentData => {
            Sessions.findOne({
                where: {
                    session_token: req.cookies.session_token
                }
            }).then(dbSessionData => {
                Experiment.create({
                    experiment_name: dbFromExperimentData.experiment_name + Math.floor(Math.random() * 1000),
                    scenario_id: dbFromExperimentData.scenario_id,
                    user_id: dbSessionData.user_id
                })
                    .then(dbExperimentData => {
                        Promise.allSettled([
                            new Promise(resolve => {
                                ExperimentAsset.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentAssetData => {
                                        let updates = [];
                                        for (item of dbExperimentAssetData) {
                                            updates.push(
                                                ExperimentAsset.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    iteration_number: item.iteration_number,
                                                    asset_id: item.asset_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentCoreSoakTime.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentCoreSoakTimeData => {
                                        let updates = [];
                                        for (item of dbExperimentCoreSoakTimeData) {
                                            await ExperimentCoreSoakTime.create({
                                                experiment_id: dbExperimentData.experiment_id,
                                                iteration_number: item.iteration_number,
                                                core_soak_time_id: item.core_soak_time_id
                                            })
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                JobList.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbJobListData => {
                                        let updates = [];
                                        for (item of dbJobListData) {
                                            await JobList.create({
                                                experiment_id: dbExperimentData.experiment_id,
                                                job_number: item.job_number,
                                                iteration_number: item.iteration_number,
                                                model_number: item.model_number,
                                                job_mix_id: item.job_mix_id,
                                                start: item.start,
                                                current_task: item.current_task,
                                                need_transit: item.need_transit,
                                                transit_type: item.transit_type,
                                                resource_type: item.resource_type,
                                                next_type: item.next_type,
                                                resource_keep: item.resource,
                                                qc_pass: item.qc_pass
                                            })
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentHoo.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentHooData => {
                                        let updates = []
                                        for (item of dbExperimentHooData) {
                                            updates.push(
                                                ExperimentHoo.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    iteration_number: item.iteration_number,
                                                    hours_of_operation_id: item.hours_of_operation_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentJobMix.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentJobMixData => {
                                        let updates = [];
                                        for (item of dbExperimentJobMixData) {
                                            updates.push(
                                                ExperimentJobMix.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    iteration_number: item.iteration_number,
                                                    job_mix_id: item.job_mix_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentOpToLoc.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentOpToLocData => {
                                        let updates = [];
                                        for (item of dbExperimentOpToLocData) {
                                            updates.push(
                                                ExperimentOpToLoc.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    iteration_number: item.iteration_number,
                                                    operation_to_location_id: item.operation_to_location_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentProcessTime.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentProcessTimeData => {
                                        let updates = [];
                                        for (item of dbExperimentProcessTimeData) {
                                            updates.push(
                                                ExperimentProcessTime.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    iteration_number: item.iteration_number,
                                                    process_time_id: item.process_time_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentRouting.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentRoutingData => {
                                        let updates = [];
                                        for (item of dbExperimentRoutingData) {
                                            updates.push(
                                                ExperimentRouting.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    iteration_number: item.iteration_number,
                                                    routing_id: item.routing_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentSite.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentSiteData => {
                                        let updates = [];
                                        for (item of dbExperimentSiteData) {
                                            updates.push(
                                                ExperimentSite.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    site_id: item.site_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            }),
                            new Promise(resolve => {
                                ExperimentTaskSequence.findAll({
                                    where: {
                                        experiment_id: req.params.id
                                    }
                                })
                                    .then(async dbExperimentTaskSequenceData => {
                                        let updates = [];
                                        for (item of dbExperimentTaskSequenceData) {
                                            updates.push(
                                                ExperimentTaskSequence.create({
                                                    experiment_id: dbExperimentData.experiment_id,
                                                    iteration_number: item.iteration_number,
                                                    task_sequence_id: item.task_sequence_id
                                                })
                                            )
                                        }
                                        await Promise.allSettled(updates);
                                        resolve();
                                    })
                            })
                        ])
                            .then(promiseResponse => {
                                res.json(dbExperimentData);
                            })
                    })
            })
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
            console.log("AAAAAAAAAAAAAAAAAA\n", dbExperimentData);
            res.status(204);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;