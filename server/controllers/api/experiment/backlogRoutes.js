const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { Backlog } = require('../../../models');

router.get('/', (req, res) => {
    Backlog.findAll()
        .then(dbBacklogData => res.json(dbBacklogData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    Backlog.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbBacklogData => res.json(dbBacklogData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/file/:id', (req, res) => {
    let form = new multiparty.Form();
    form.parse
    console.log(req.body);
    res.status(204).end()
});

router.put('/:id', (req, res) => {
    Backlog.update(req.body, {
        where: {
            experiment_hoo_id: req.params.id
        }
    })
        .then(dbBacklogData => res.json(dbBacklogData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;