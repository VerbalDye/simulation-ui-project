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
            { model: Core },
            { model: CoreSoakTime },
        ]
    })
        .then(dbCoreModelData => res.json(dbCoreModelData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

module.exports = router;