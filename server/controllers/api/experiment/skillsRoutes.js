const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentSkills, Skills } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentSkills.findAll()
        .then(dbExperimentSkillsData => res.json(dbExperimentSkillsData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentSkills.findAll({
        where: {
            experiment_id: req.params.id
        },
        // order: [
        //     [Skills, 'process_time', 'ASC']
        // ],
        include: [{
            model: Skills
        }]
    })
        .then(dbExperimentSkillsData => res.json(dbExperimentSkillsData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.post('/:id', (req, res) => {
    
// });

module.exports = router;