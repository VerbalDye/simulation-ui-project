const router = require('express').Router();
const sequelize = require('../../../config/connection');
const {
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

router.get('/user/:id', (req, res) => {
    Experiment.findAll({
        where: {
            user_id: req.params.id
        }
    })
        .then(dbExperimentData => {
            res.json(dbExperimentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

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
                            ExperimentAsset.findAll({
                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentAssetData => {
                                    dbExperimentAssetData.forEach(item => {
                                        ExperimentAsset.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            asset_id: item.asset_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentCoreSoakTime.findAll({

                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentCoreSoakTimeData => {
                                    dbExperimentCoreSoakTimeData.forEach(item => {
                                        ExperimentCoreSoakTime.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            core_soak_time_id: item.core_soak_time_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentHoo.findAll({

                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentHooData => {
                                    dbExperimentHooData.forEach(item => {
                                        ExperimentHoo.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            hours_of_operation_id: item.hours_of_operation_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentJobMix.findAll({

                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentJobMixData => {
                                    dbExperimentJobMixData.forEach(item => {
                                        ExperimentJobMix.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            job_mix_id: item.job_mix_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentOpToLoc.findAll({

                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentOpToLocData => {
                                    dbExperimentOpToLocData.forEach(item => {
                                        ExperimentOpToLoc.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            operation_to_location_id: item.operation_to_location_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentProcessTime.findAll({
                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentProcessTimeData => {
                                    dbExperimentProcessTimeData.forEach(item => {
                                        ExperimentProcessTime.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            process_time_id: item.process_time_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentRouting.findAll({
                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentRoutingData => {
                                    dbExperimentRoutingData.forEach(item => {
                                        ExperimentRouting.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            routing_id: item.routing_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentSite.findAll({

                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentSiteData => {
                                    dbExperimentSiteData.forEach(item => {
                                        ExperimentSite.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            site_id: item.site_id
                                        })
                                    })
                                    return
                                }),
                            ExperimentTaskSequence.findAll({

                                where: {
                                    experiment_id: req.params.id
                                }
                            })
                                .then(dbExperimentTaskSequenceData => {
                                    dbExperimentTaskSequenceData.forEach(item => {
                                        ExperimentTaskSequence.create({
                                            experiment_id: dbExperimentData.experiment_id,
                                            iteration_number: item.iteration_number,
                                            task_sequence_id: item.task_sequence_id
                                        })
                                    })
                                    return
                                })
                        ])
                            .then(dbExperimentResponses => {
                                // if (!dbExperimentData[0]) {
                                //     res.status(400).json({ message: 'Something went wrong. Check submitted values and try again.' });
                                //     return;
                                // }
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
            if (!dbExperimentData[0]) {
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