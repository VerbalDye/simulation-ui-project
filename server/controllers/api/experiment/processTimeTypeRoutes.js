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

// router.put('/:id', (req, res) => {
//     ExperimentTimeType.update(req.body, {
//         where: {
//             experiment_phases_id: req.params.id
//         }
//     })
//         .then(dbExperimentTimeTypeData => res.json(dbExperimentTimeTypeData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;