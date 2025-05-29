const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentHoo, HoursOfOperation } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentHoo.findAll()
        .then(dbExperimentHooData => res.json(dbExperimentHooData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentHoo.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: HoursOfOperation
        }]
    })
        .then(dbExperimentHooData => res.json(dbExperimentHooData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentHoo.update(req.body, {
        where: {
            experiment_hoo_id: req.params.id
        }
    })
        .then(dbExperimentHooData => res.json(dbExperimentHooData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/update/:id', async (req, res) => {
    try {
        let dbExperimentHooData = await ExperimentHoo.findAll({
            where: {
                experiment_id: req.params.id
            },
            include: [{
                model: HoursOfOperation
            }]
        })
        if (dbExperimentHooData[0].hours_of_operation.is_default == 1) {
            let promises = [];
            let hooEntries = await HoursOfOperation.bulkCreate(req.body);
            hooEntries.forEach((entry, index) => {
                promises.push(ExperimentHoo.update({ hours_of_operation_id: entry.hours_of_operation_id }, {
                    where: {
                        experiment_hoo_id: dbExperimentHooData[index].experiment_hoo_id
                    }
                }))
            })
            let response = await Promise.all(promises);
            res.status(200).json(response);
        } else {
            let promises = [];
            req.body.forEach((entry, index) => {
                promises.push(HoursOfOperation.update(entry, {
                    where: {
                        hours_of_operation_id: dbExperimentHooData[index].hours_of_operation_id
                    }
                }))
            })
            let response = await Promise.all(promises);
            res.status(200).json(response);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router;