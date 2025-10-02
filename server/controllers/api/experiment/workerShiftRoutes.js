const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentSkills, ExperimentWorkerShift, Skills, WorkerShift, Worker } = require('../../../models');

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
                },
                required: true
            }]
        },
        {
            model: Skills,
            include: [{
                model: ExperimentSkills,
                where: {
                    experiment_id: req.params.id
                },
                required: true
            }]
        }
        ]
    }).then(dbExperimentWorkerShiftData => res.json(dbExperimentWorkerShiftData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/shifts/:id', async (req, res) => {
    try {
        let workerIDs = [];
        req.body.shifts.forEach(shift => {
            if (workerIDs.filter(id => id == shift.worker).length < 1) {
                workerIDs.push(shift.worker);
            }
        })
        let dbWorkerShiftData = await ExperimentWorkerShift.findAll({
            where: {
                experiment_id: req.params.id
            },
            include: [{
                model: WorkerShift,
                where: {
                    worker_id: workerIDs
                },
                required: true
            }]
        })
        // console.log(dbWorkerShiftData);
        dbWorkerShiftData = dbWorkerShiftData.map(e => {
            return e.experiment_worker_shift_id
        })
        // console.log(dbWorkerShiftData);
        await ExperimentWorkerShift.destroy({
            where: {
                experiment_worker_shift_id: dbWorkerShiftData
            }
        })
        let dbNewWorkerShiftData = await WorkerShift.bulkCreate(req.body.shifts);
        dbNewWorkerShiftData = dbNewWorkerShiftData.map(e => {
            return {
                worker_shift_id: e.worker_shift_id,
                experiment_id: req.params.id,
                iteration_number: 0
            }
        })
        let dbNewExperimentWorkerShiftData = await ExperimentWorkerShift.bulkCreate(dbNewWorkerShiftData);
        res.json(dbNewExperimentWorkerShiftData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.put('/skills/:id', async (req, res) => {
    res.status(200);
    try {
        let workerIDs = [];
        req.body.skills.forEach(shift => {
            if (workerIDs.filter(id => id == shift.worker).length < 1) {
                workerIDs.push(shift.worker);
            }
        })
        let dbSkillsData = await ExperimentSkills.findAll({
            where: {
                experiment_id: req.params.id
            },
            include: [{
                model: Skills,
                where: {
                    worker_id: workerIDs
                },
                required: true
            }]
        })
        // console.log(dbSkillsData);
        dbSkillsData = dbSkillsData.map(e => {
            return e.experiment_skills_id
        })
        // console.log(dbWorkerShiftData);
        await ExperimentSkills.destroy({
            where: {
                experiment_skills_id: dbSkillsData
            }
        })
        let dbNewSkillsData = await Skills.bulkCreate(req.body.skills);
        dbNewSkillsData = dbNewSkillsData.map(e => {
            return {
                skills_id: e.skills_id,
                experiment_id: req.params.id,
                iteration_number: 0
            }
        })
        let dbNewExperimentSkillsData = await ExperimentWorkerShift.bulkCreate(dbNewSkillsData);
        res.json(dbNewExperimentSkillsData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router;