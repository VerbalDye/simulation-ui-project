const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { LaborUtilization } = require('../../../models');

router.get('/', (req, res) => {
    LaborUtilization.findAll()
        .then(dbLaborUtilizationData => res.json(dbLaborUtilizationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    LaborUtilization.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbLaborUtilizationData => res.json(dbLaborUtilizationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;