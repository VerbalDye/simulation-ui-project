const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Operation } = require('../../models');

router.get('/', (req, res) => {
    Operation.findAll()
        .then(dbOperationData => res.json(dbOperationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;