const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Scenario, ScenarioFilter } = require('../../models');

router.get('/', (req, res) => {
    Scenario.findAll({
        include: [{
            model: ScenarioFilter
        }]
    })
        .then(dbScenarioData => res.json(dbScenarioData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;