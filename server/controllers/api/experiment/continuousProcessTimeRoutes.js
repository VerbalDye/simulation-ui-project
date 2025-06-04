const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentTimeDistribution, ProcessTimeDistribution } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentTimeDistribution.findAll()
        .then(dbExperimentTimeDistributionData => res.json(dbExperimentTimeDistributionData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentTimeDistribution.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{ model: ProcessTimeDistribution }]
    })
        .then(dbExperimentTimeDistributionData => res.json(dbExperimentTimeDistributionData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.put('/:id', (req, res) => {
//     ExperimentTimeDistribution.update(req.body, {
//         where: {
//             experiment_phases_id: req.params.id
//         }
//     })
//         .then(dbExperimentTimeDistributionData => res.json(dbExperimentTimeDistributionData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;