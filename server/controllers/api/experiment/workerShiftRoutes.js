const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentWorkerShift, WorkerShift, Worker } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentWorkerShift.findAll()
        .then(dbExperimentWorkerShiftData => res.json(dbExperimentWorkerShiftData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.get('/:id', (req, res) => {
//     ExperimentWorkerShift.findAll({
//         where: {
//             experiment_id: req.params.id
//         },
//         // order: [
//         //     [WorkerShift, 'process_time', 'ASC']
//         // ],
//         include: [{
//             model: WorkerShift
//         }]
//     })
//         .then(dbExperimentWorkerShiftData => res.json(dbExperimentWorkerShiftData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

router.get('/:id', (req, res) => {
    Worker.findAll({
        where: {
            is_default: true
        },
        include: [{ 
            model: WorkerShift,
            include: [{
                model: ExperimentWorkerShift,
                where: {
                    experiment_id: req.params.id
                }
            }]
        }]
    })
});

module.exports = router;