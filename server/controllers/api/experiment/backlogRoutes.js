const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { Backlog, ModelObject } = require('../../../models');

router.get('/', (req, res) => {
    Backlog.findAll()
        .then(dbBacklogData => res.json(dbBacklogData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/template', (req, res) => {
    const file = `${__dirname}/../../../assets/backlog_example.csv`
    res.download(file);
})

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

router.post('/bulk/:id', (req, res) => {
    let models = [];
    let invalidData = false;
    Backlog.destroy({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbDeleteBacklogData => {
            req.body.data.forEach(entry => {
                models.push(
                    new Promise(resolve => {
                        if (entry.model_number) {
                            ModelObject.findOrCreate({
                                where: {
                                    model_number: entry.model_number
                                },
                                defaults: {
                                    model_number: entry.model_number
                                }
                            })
                            resolve();
                        } else {
                            invalidData = true;
                        }
                    })
                )
            })
            if (!invalidData) {
                Promise.allSettled(models)
                .then(dbPromiseData => {
                    Backlog.bulkCreate(req.body.data)
                        .then(dbBacklogData => res.json(dbBacklogData))
                        .catch(err => {
                            console.log(err);
                            res.status(400).json(err);
                        });
                })
            } else {
                res.status(400).json({ message: "Invalid Backlog Input"});
            }
        })
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