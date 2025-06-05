const router = require('express').Router();
const sequelize = require('../../config/connection');
const { CoreModel, ModelObject, Core, CoreSoakTime } = require('../../models');

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
        })
        res.json({ core: coreData, core_model: coreModelData, core_soak_time: coreSoakTimeData });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

module.exports = router;