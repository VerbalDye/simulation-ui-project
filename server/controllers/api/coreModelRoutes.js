const router = require('express').Router();
const sequelize = require('../../config/connection');
const { CoreModel } = require('../../models');

router.get('/', (req, res) => {
    CoreModel.findAll()
        .then(dbCoreModelData => res.json(dbCoreModelData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    
});

module.exports = router;