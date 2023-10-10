const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { Sequelize } = require('sequelize');
const { ExperimentGoal, Asset } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentGoal.findAll()
        .then(dbExperimentGoalData => res.json(dbExperimentGoalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentGoal.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentGoalData => res.json(dbExperimentGoalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/bulk', (req, res) => {
    ExperimentGoal.bulkCreate(req.body.data)
        .then(dbExperimentGoalData => res.json(dbExperimentGoalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/', (req, res) => {
    ExperimentGoal.create(req.body)
        .then(dbExperimentGoalData => res.json(dbExperimentGoalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/bulk', async (req, res) => {
    let promises = [];
    req.body.data.forEach(entry => {
        promises.push(ExperimentGoal.update(entry, {
            where: {
                experiment_goal_id: entry.experiment_goal_id
            }
        }))
    })
    console.log(promises);
    try {
        let responses = await Promise.allSettled(promises)
        console.log(responses);
        res.json({ message: 'Success' })
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', (req, res) => {
    ExperimentGoal.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentGoalData => res.json(dbExperimentGoalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.delete('/bulk', (req, res) => {
    ExperimentGoal.destroy({
        where: {
            experiment_goal_id: {
                [Sequelize.Op.in]: req.body.data
            }
        }
    })
        .then(dbExperimentGoalData => res.json(dbExperimentGoalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;