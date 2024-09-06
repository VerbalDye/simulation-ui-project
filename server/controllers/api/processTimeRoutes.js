const router = require('express').Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../../config/connection');
const { ExperimentProcessTime, ProcessTime, Scenario } = require('../../models');
const { withAdminAuth } = require('../../utils/auth');

// router.get('/', (req, res) => {
//     ExperimentProcessTime.findAll()
//         .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

// router.get('/:id', (req, res) => {
//     ExperimentProcessTime.findAll({
//         where: {
//             experiment_id: req.params.id
//         },
//         // order: [
//         //     [ProcessTime, 'process_time', 'ASC']
//         // ],
//         include: [{
//             model: ProcessTime
//         }]
//     })
//         .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

router.post('/change-default', (req, res) => {
    let processTimeEntries = []
    Scenario.findAll()
        .then(dbScenarioData => {
            ProcessTime.findAll({
                // include: [{
                //     model: ExperimentProcessTime,
                //     where: {
                //         experiment_id: [2, 3, 4]
                //     }
                // }],
                where: {
                    model_number: req.body.model_number,
                    asset_id: req.body.asset_id,
                    // '$experiment_process_time.experiment_id$': 2
                }
            }).then(dbProcessTimeData => {
                req.body.model_number.forEach(model_number => {
                    req.body.asset_id.forEach(asset_id => {
                        req.body.process_time.forEach(process_time => {
                            processTimeEntries.push(ProcessTime.create({
                                asset_id: asset_id,
                                model_number: model_number,
                                is_default: true,
                                operation_id: req.body.operation_id(asset_id),
                                process_time: process_time,
                            }))
                        })
                    })
                })
                console.log(processTimeEntries)
                res.status(200).json({"message": "Processing Time Saved"})
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

// router.put('/:id', (req, res) => {
//     ExperimentProcessTime.update(req.body, {
//         where: {
//             experiment_site_id: req.params.id
//         }
//     })
//         .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;