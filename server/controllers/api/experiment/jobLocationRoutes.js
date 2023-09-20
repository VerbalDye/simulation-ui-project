const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { JobLocation, Operation } = require('../../../models');

router.get('/', (req, res) => {
    JobLocation.findAll()
        .then(dbJobLocationData => res.json(dbJobLocationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    JobLocation.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: Operation,
        }]
    })
        .then(dbJobLocationData => res.json(dbJobLocationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    JobLocation.update(req.body, {
        where: {
            job_location_id: req.params.id
        }
    })
        .then(dbJobLocationData => res.json(dbJobLocationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.put('/bulk/:id', (req, res) => {
//     JobLocation.update(req.body, {
//         where: {
//             experiment_id: req.params.id
//         }
//     })
//         .then(dbJobLocationData => res.json(dbJobLocationData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;