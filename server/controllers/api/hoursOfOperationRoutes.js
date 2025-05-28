const router = require('express').Router();
const sequelize = require('../../config/connection');
const { HoursOfOperation } = require('../../models');

router.get('/', (req, res) => {
    HoursOfOperation.findAll()
        .then(dbHoursOfOperationData => res.json(dbHoursOfOperationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/default', (req, res) => {
    HoursOfOperation.findAll({
        where: {
            is_default: 1
        }
    })
        .then(dbHoursOfOperationData => res.json(dbHoursOfOperationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    HoursOfOperation.findAll({
        where: {
            site_id: req.params.id
        }
    })
        .then(dbHoursOfOperationData => res.json(dbHoursOfOperationData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;