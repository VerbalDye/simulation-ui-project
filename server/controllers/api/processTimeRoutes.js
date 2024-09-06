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
    // Scenario.findAll()
    //     .then(dbScenarioData => {
    //         dbScenarioData.forEach(entry => {
    //             ExperimentProcessTime.findAll({
    //                 where: {
    //                     experiment_id: entry.experiment_id,
    //                     '$ProcessTime.model_number$': req.body.model_number,
    //                     '$ProcessTime.asset_id': req.body.asset_id
    //                 },
    //                 include: [{
    //                     model: ProcessTime
    //                 }]
    //             }).then(db)
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(400).json(err);
    //     });
        ProcessTime.findAll({
            include: [{
                model: ExperimentProcessTime
            }],
            where: {
                model_number: req.body.model_number,
                asset_id: req.body.asset_id,
                '$experiment_process_time.experiment_id$': 2
            }
        }).then(dbProcessTimeData => res.json(dbProcessTimeData));
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