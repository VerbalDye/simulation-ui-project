const router = require('express').Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../../../config/connection');
const { Arrival } = require('../../../models');

router.get('/', (req, res) => {
    Arrival.findAll()
        .then(dbArrivalData => res.json(dbArrivalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/distinct/:id', (req, res) => {
    sequelize.query('SELECT DISTINCT job_number, model_number FROM arrival WHERE experiment_id = :expId',
    {
        replacements: { expId: req.params.id }
    })
        .then(dbArrivalData => res.json(dbArrivalData[0]))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    Arrival.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbArrivalData => res.json(dbArrivalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    Arrival.update(req.body, {
        where: {
            job_list_id: req.params.id
        }
    })
        .then(dbArrivalData => res.json(dbArrivalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/bulk/:id', (req, res) => {
    Arrival.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbArrivalData => res.json(dbArrivalData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;