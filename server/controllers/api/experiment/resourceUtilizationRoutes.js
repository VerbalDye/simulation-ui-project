const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ResourceUtilization } = require('../../../models');

router.get('/', (req, res) => {
    ResourceUtilization.findAll()
        .then(dbResourceUtilizationData => res.json(dbResourceUtilizationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/processed/:id', (req, res) => {
    sequelize.query('SELECT * FROM processed_utilization WHERE experiment_id = :expId', 
    {
        replacements: { expId: parseInt(req.params.id)}
    })
        .then(dbResourceUtilizationData => res.json(dbResourceUtilizationData[0]))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ResourceUtilization.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbResourceUtilizationData => res.json(dbResourceUtilizationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ResourceUtilization.update(req.body, {
        where: {
            experiment_phases_id: req.params.id
        }
    })
        .then(dbResourceUtilizationData => res.json(dbResourceUtilizationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;