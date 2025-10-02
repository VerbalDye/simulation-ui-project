const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentPriority, Priority } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentPriority.findAll()
        .then(dbExperimentPriorityData => res.json(dbExperimentPriorityData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentPriority.findAll({
        where: {
            experiment_id: req.params.id
        },
        // order: [
        //     [Priority, 'process_time', 'ASC']
        // ],
        include: [{
            model: Priority
        }]
    })
        .then(dbExperimentPriorityData => res.json(dbExperimentPriorityData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', async (req, res) => {
    try {
        let operationIDs = [];
        req.body.priority.forEach(priority => {
            if (operationIDs.filter(id => id == priority.operation_id).length < 1) {
                operationIDs.push(priority.operation_id);
            }
        })
        let dbPriorityData = await ExperimentPriority.findAll({
            where: {
                experiment_id: req.params.id
            },
            include: [{
                model: Priority,
                where: {
                    operation_id: operationIDs
                },
                required: true
            }]
        })
        dbPriorityData = dbPriorityData.map(e => {
            return e.experiment_priority_id
        })
        await ExperimentPriority.destroy({
            where: {
                experiment_priority_id: dbPriorityData
            }
        })
        let dbNewPriorityData = await Priority.bulkCreate(req.body.priority);
        dbNewPriorityData = dbNewPriorityData.map(e => {
            return {
                priority_id: e.priority_id,
                experiment_id: req.params.id,
                iteration_number: 0
            }
        })
        let dbNewExperimentPriorityData = await ExperimentPriority.bulkCreate(dbNewPriorityData);
        res.json(dbNewExperimentPriorityData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router;