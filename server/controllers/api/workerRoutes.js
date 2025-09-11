const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Worker } = require('../../models');

router.get('/', (req, res) => {
    Worker.findAll()
        .then(dbWorkerData => res.json(dbWorkerData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;