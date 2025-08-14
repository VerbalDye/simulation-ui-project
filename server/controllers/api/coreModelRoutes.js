const router = require('express').Router();
const sequelize = require('../../config/connection');
const { CoreModel, ModelObject, Core, CoreSoakTime, ExperimentCore } = require('../../models');

router.get('/', (req, res) => {
    CoreModel.findAll()
        .then(dbCoreModelData => res.json(dbCoreModelData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

});

router.get('/soak-time', (req, res) => {
    CoreModel.findAll({
        include: [
            { model: ModelObject },
            {
                model: Core,
                include: [{ model: CoreSoakTime }]
            }
        ]
    })
        .then(dbCoreModelData => res.json(dbCoreModelData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/', async (req, res) => {
    try {
        let coreData = await Core.create({ core_number: req.body.core_number });
        let coreModelData = await CoreModel.create({
            core_number: req.body.core_number,
            model_number: req.body.model_number,
            status: req.body.status
        });
        let coreSoakTimeData = await CoreSoakTime.create({
            core_number: req.body.core_number,
            model_number: req.body.model_number,
            soak_temperature_f: req.body.soak_temperature_f,
            time_minutes: req.body.time_minutes,
            core_oven_number: req.body.core_oven_number,
            core_oven_drawer_position: req.body.core_oven_drawer_position,
            is_default: 1
        });
        let experimentCoreData = await ExperimentCore.bulkCreate([
            { experiment_id: 2, core_number: req.body.core_number, available: 1 },
            { experiment_id: 3, core_number: req.body.core_number, available: 1 },
            { experiment_id: 4, core_number: req.body.core_number, available: 1 },
            { experiment_id: 5, core_number: req.body.core_number, available: 1 },
            { experiment_id: 6, core_number: req.body.core_number, available: 1 },
            { experiment_id: 7, core_number: req.body.core_number, available: 1 },
            { experiment_id: 8, core_number: req.body.core_number, available: 1 },
            { experiment_id: 9, core_number: req.body.core_number, available: 1 },
            { experiment_id: 10, core_number: req.body.core_number, available: 1 },
        ])
        res.json({ core: coreData, core_model: coreModelData, core_soak_time: coreSoakTimeData, experiment_core: experimentCoreData });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.delete('/', async (req, res) => {
    try {
        let promises = []
        req.body.forEach(entry => {
            promises.push(
                Core.destroy({
                    where: {
                        core_number: entry
                    }
                })
            )
        })
        let response = await Promise.all(promises)
        res.json(response)
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.put('/', async (req, res) => {
    try {
        let promises = [];
        req.body.forEach(entry => {
            promises.push(
                CoreModel.update({
                    status: entry.status,
                    model_number: entry.model_number
                },
                    {
                        where: {
                            core_number: entry.core_number
                        }
                    }))
            promises.push(
                CoreSoakTime.update({
                    core_number: entry.core_number,
                    model_number: entry.model_number,
                    soak_temperature_f: entry.soak_temperature_f,
                    time_minutes: entry.time_minutes,
                    core_oven_number: entry.core_oven_number,
                    core_oven_drawer_position: entry.core_oven_drawer_position,
                    is_default: 1
                },
                {
                    where: {
                        core_number: entry.core_number
                    }
                }
                )
            )
        })
        let response = await Promise.all(promises)
        res.json(response);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router;