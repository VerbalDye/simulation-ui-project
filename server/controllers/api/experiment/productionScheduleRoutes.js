const router = require('express').Router();
const sequelize = require('../../../config/connection');
// const { ProductionSchedule } = require('../../../models');

// router.get('/', (req, res) => {
//     ProductionSchedule.findAll()
//         .then(dbProductionScheduleData => res.json(dbProductionScheduleData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

router.get('/processed/:id', (req, res) => {
    sequelize.query('SELECT * FROM production_schedule WHERE experiment_id = :expId', 
    {
        replacements: { expId: parseInt(req.params.id)}
    })
        .then(dbProductionScheduleData => res.json(dbProductionScheduleData[0]))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.get('/:id', (req, res) => {
//     ProductionSchedule.findAll({
//         where: {
//             experiment_id: req.params.id
//         }
//     })
//         .then(dbProductionScheduleData => res.json(dbProductionScheduleData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;