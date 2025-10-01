const router = require('express').Router();
const sequelize = require('../../config/connection');
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

module.exports = router;