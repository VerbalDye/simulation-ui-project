const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentTimeDistribution, ProcessTimeDistribution } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentTimeDistribution.findAll()
        .then(dbExperimentTimeDistributionData => res.json(dbExperimentTimeDistributionData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentTimeDistribution.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{ model: ProcessTimeDistribution }]
    })
        .then(dbExperimentTimeDistributionData => res.json(dbExperimentTimeDistributionData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', async (req, res) => {
    try {
        if (req.body[0].iteration_number == 1) {
            let promises = []
            for (let i = 0; i < req.body.length; i++) {
                let entry = req.body[i];
                promises.push(ProcessTimeDistribution.update(entry.process_time_distribution, {
                    where: {
                        process_time_distribution_id: entry.process_time_distribution_id
                    }
                }));
            }
            let response = await Promise.all(promises);
            res.json(response);
        } else {
            let timeEntries = [];
            req.body.forEach(entry => {
                timeEntries.push({
                    asset_id: entry.process_time_distribution.asset_id,
                    operation_id: entry.process_time_distribution.operation_id,
                    model_number: entry.process_time_distribution.model_number,
                    distribution: entry.process_time_distribution.distribution,
                    param1: entry.process_time_distribution.param1,
                    param2: entry.process_time_distribution.param2,
                    param3: entry.process_time_distribution.param3,
                    min: entry.process_time_distribution.min,
                    max: entry.process_time_distribution.max,
                    is_default: entry.process_time_distribution.is_default
                })
            })
            let processTimeData = await ProcessTimeDistribution.bulkCreate(timeEntries);
            timeEntries = [];
            processTimeData.forEach(entry => {
                timeEntries.push({
                    experiment_id: req.params.id,
                    iteration_number: 1,
                    process_time_distribution_id: entry.process_time_distribution_id
                });
            })
            let response = await ExperimentTimeDistribution.bulkCreate(timeEntries);
            res.json(response);
        }
        // for (let i = 0; i < req.body.length; i++) {
        //     let entry = req.body[i];
        //     let distributionData = await ExperimentTimeDistribution.findOne({
        //         where: {
        //             experiment_time_distribution_id: entry.experiment_time_distribution_id
        //         },
        //         include: [{ model: ProcessTimeDistribution }]
        //     })
        //     if (distributionData.process_time_distribution.is_default) {
        //         let processEntry = await ProcessTimeDistribution.create({
        //             asset_id: entry.process_time_distribution.asset_id,
        //             operation_id: entry.process_time_distribution.operation_id,
        //             model_number: entry.process_time_distribution.model_number,
        //             distribution: entry.process_time_distribution.distribution,
        //             param1: entry.process_time_distribution.param1,
        //             param2: entry.process_time_distribution.param2,
        //             param3: entry.process_time_distribution.param3,
        //             min: entry.process_time_distribution.min,
        //             max: entry.process_time_distribution.max,
        //             is_default: entry.process_time_distribution.is_default
        //         })
        //         await ExperimentTimeDistribution.create({
        //             experiment_id: req.params.id,
        //             iteration_number: 1,
        //             process_time_distribution_id: processEntry.process_time_distribution_id
        //         })
        //     } else {
        //         await ProcessTimeDistribution.update(entry, {
        //             where: {
        //                 process_time_distribution_id: entry.process_time_distribution_id
        //             }
        //         })
        //     }
        // }
        // res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;