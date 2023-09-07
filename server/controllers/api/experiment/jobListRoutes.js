const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { JobList } = require('../../../models');

router.get('/', (req, res) => {
    JobList.findAll()
        .then(dbJobListData => res.json(dbJobListData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    JobList.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbJobListData => res.json(dbJobListData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    JobList.update(req.body, {
        where: {
            job_list_id: req.params.id
        }
    })
        .then(dbJobListData => res.json(dbJobListData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/bulk/:id', (req, res) => {
    JobList.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbJobListData => res.json(dbJobListData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;