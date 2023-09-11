const router = require('express').Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../../../config/connection');
const { ExperimentProcessTime, ProcessTime } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentProcessTime.findAll()
        .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentProcessTime.findAll({
        where: {
            experiment_id: req.params.id
        },
        // order: [
        //     [ProcessTime, 'process_time', 'ASC']
        // ],
        include: [{
            model: ProcessTime
        }]
    })
        .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentProcessTime.update(req.body, {
        where: {
            experiment_site_id: req.params.id
        }
    })
        .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/bulk/:id', (req, res) => {
    req.body.data.forEach(item => {
        ProcessTime.create({
            asset_id: item.asset_id,
            operation_id: item.operation_id,
            process_time: item.process_time
        })
            .then(dbProcessTimeData => {
                ExperimentProcessTime.create({
                    experiment_id: req.params.id,
                    iteration_number: item.iteration_number,
                    process_time_id: dbProcessTimeData.process_time_id
                })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    })
            })
    });
    res.status(200).json({ message: "Success" });
})

router.put('/bulk/:id', (req, res) => {
    new Promise(async resolve => {
        let updates = []
        for (item of req.body.data) {
            updates.push(
                ProcessTime.update(
                    {
                        process_time: item.process_time
                    },
                    {
                        where: {
                            process_time_id: item.process_time_id
                        }
                    }
                )
            ) 
        }
        await Promise.allSettled(updates)
        resolve();
    })
        .then(dbProcessTimeData => res.status(200).json({ message: "Success" }))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.delete('/bulk/:id', (req, res) => {
    console.log(req.body)
    ProcessTime.destroy({
        where: {
            process_time_id: {
                [Sequelize.Op.in]: req.body.data
            }
        }
    })
        .then(dbExperimentProcessTimeData => res.json(dbExperimentProcessTimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

module.exports = router;