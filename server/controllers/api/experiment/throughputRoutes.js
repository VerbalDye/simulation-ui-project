const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { Throughput } = require('../../../models');

router.get('/', (req, res) => {
    Throughput.findAll()
        .then(dbThroughputData => res.json(dbThroughputData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/processed/:id', (req, res) => {
    sequelize.query('SELECT DISTINCT week, iteration_number, replication, weekly_throughput FROM processed_throughput WHERE experiment_id = :expId', 
    {
        replacements: { expId: parseInt(req.params.id)}
    })
        .then(dbThroughputData => res.json(dbThroughputData[0]))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    Throughput.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbThroughputData => res.json(dbThroughputData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    Throughput.update(req.body, {
        where: {
            experiment_phases_id: req.params.id
        }
    })
        .then(dbThroughputData => res.json(dbThroughputData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;