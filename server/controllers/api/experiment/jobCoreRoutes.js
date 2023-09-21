const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { Arrival, JobCore } = require('../../../models');

router.get('/', (req, res) => {
    JobCore.findAll()
        .then(dbJobCoreData => res.json(dbJobCoreData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    JobCore.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbJobCoreData => res.json(dbJobCoreData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/bulk/:id', (req, res) => {
    let promises = []
    req.body.data.forEach(entry => {
        promises.push(
            JobCore.update({ core_number: entry.core_number }, {
                where: {
                    job_core_id: entry.job_core_id
                }
            })
        )
    })
    Promise.allSettled(promises)
        .then(dbPromiseData => res.json({ message: "Success" }))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    JobCore.update(req.body, {
        where: {
            job_core_id: req.params.id
        }
    })
        .then(dbJobCoreData => res.json(dbJobCoreData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;