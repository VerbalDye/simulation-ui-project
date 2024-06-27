const router = require('express').Router();
const sequelize = require('../../config/connection');
const { ModelObject } = require('../../models');

router.get('/', (req, res) => {
    ModelObject.findAll()
        .then(dbModelData => res.json(dbModelData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ModelObject.findAll({
        where: {
            site_id: req.params.id
        }
    })
        .then(dbModelData => res.json(dbModelData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;