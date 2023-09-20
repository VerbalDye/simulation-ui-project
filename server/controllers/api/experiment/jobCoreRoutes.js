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

// router.put('/bulk/:id', (req, res) => {
//     JobCore.update(req.body, {
//         where: {
//             experiment_id: req.params.id
//         }
//     })
//         .then(dbJobCoreData => res.json(dbJobCoreData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;