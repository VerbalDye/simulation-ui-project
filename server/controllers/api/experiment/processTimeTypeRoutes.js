const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentTimeType } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentTimeType.findAll()
        .then(dbExperimentTimeTypeData => res.json(dbExperimentTimeTypeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentTimeType.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentTimeTypeData => res.json(dbExperimentTimeTypeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/', async (req, res) => {
    let promises = []
    try {
        if (req.body[0].iteration_number == 1) {
            req.body.forEach(entry => {
                promises.push(ExperimentTimeType.update(entry, {
                    where: {
                        experiment_time_type_id: entry.experiment_time_type_id
                    }
                }))
            })
            let response = await Promise.all(promises);
            res.json(response);
        } else {
            req.body.forEach(e => e.iteration_number = 1)
            req.body.forEach(e => delete e.experiment_time_type_id);
            console.log(req.body)
            let response = await ExperimentTimeType.bulkCreate(req.body);
            res.json(response);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    };
});

module.exports = router;