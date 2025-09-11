const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Priority } = require('../../models');

router.get('/', (req, res) => {
    Priority.findAll()
        .then(dbPriorityData => res.json(dbPriorityData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;