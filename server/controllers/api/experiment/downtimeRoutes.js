const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentDowntime, Downtime } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentDowntime.findAll()
        .then(dbExperimentDowntimeData => res.json(dbExperimentDowntimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentDowntime.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentDowntimeData => res.json(dbExperimentDowntimeData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.put('/:id', (req, res) => {
//     ExperimentDowntime.update(req.body, {
//         where: {
//             experiment_id: req.params.id
//         }
//     })
//         .then(dbExperimentDowntimeData => res.json(dbExperimentDowntimeData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;