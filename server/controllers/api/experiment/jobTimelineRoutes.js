const router = require('express').Router();
const sequelize = require('../../../config/connection');
// const { Throughput } = require('../../../models');

// router.get('/', (req, res) => {
//     Throughput.findAll()
//         .then(dbThroughputData => res.json(dbThroughputData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

router.get('/processed/:id-:iteration-:replication', (req, res) => {
    sequelize.query('SELECT job_number, asset_name, task_start, task_end FROM job_timeline WHERE experiment_id = :expId AND iteration_number = :iteration_number AND replication = :replication ORDER BY asset_name', 
    {
        replacements: { expId: parseInt(req.params.id), iteration_number: parseInt(req.params.iteration), replication: parseInt(req.params.replication) }
    })
        .then(dbJobTimelineData => res.json(dbJobTimelineData[0]))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/for-export/:id')

// router.get('/:id', (req, res) => {
//     Throughput.findAll({
//         where: {
//             experiment_id: req.params.id
//         }
//     })
//         .then(dbThroughputData => res.json(dbThroughputData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

// router.put('/:id', (req, res) => {
//     Throughput.update(req.body, {
//         where: {
//             experiment_phases_id: req.params.id
//         }
//     })
//         .then(dbThroughputData => res.json(dbThroughputData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;