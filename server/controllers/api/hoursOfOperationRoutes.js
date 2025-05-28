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

router.post('/update-defaults', async (req, res) => {
    let operations = [];
    let body = JSON.parse(req.body);
    body.forEach(entry => {
        operations.push(HoursOfOperation.update(entry, {
            where: {
                hours_of_operation_id: entry.hours_of_operation_id
            }
        }))
    })
    try {
        let response = await Promise.allSettled(operations)
        res.json(response);
    } catch (err) {
        res.status(400).json(err);
    }
})

module.exports = router;