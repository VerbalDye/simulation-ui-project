const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentRouting, Routing, Asset } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentRouting.findAll()
        .then(dbExperimentRoutingData => res.json(dbExperimentRoutingData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentRouting.findAll({
        where: {
            experiment_id: req.params.id
        },
        include: [{
            model: Routing,
            where: {
                travel_allowed: true
            },
            required: true,
            include: [
                {
                    model: Asset,
                    as: 'origin_asset',
                    required: true
                },
                {
                    model: Asset,
                    as: 'destination_asset',
                    required: true
                }
            ]
        }]
    })
        .then(dbExperimentRoutingData => res.json(dbExperimentRoutingData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentRouting.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentRoutingData => res.json(dbExperimentRoutingData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/asset/from/:id', (req, res) => {
    let promises = [];
    Routing.findAll({
        where: {
            origin: req.params.id
        }
    })
        .then(dbRoutingData => {
            dbRoutingData.forEach(entry => {
                if (req.body.includes(entry.destination)) {
                    promises.push(
                        Routing.update({
                            travel_allowed: 1
                        }, {
                            where: {
                                routing_id: entry.routing_id
                            }
                        }
                        ))
                } else {
                    promises.push(
                        Routing.update({
                            travel_allowed: 0
                        }, {
                            where: {
                                routing_id: entry.routing_id
                            }
                        }
                        ))
                }
                Promise.all(promises)
                    .then(response => {
                        res.json(response)
                    })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.put('/asset/to/:id', (req, res) => {
    let promises = [];
    Routing.findAll({
        where: {
            destination: req.params.id
        }
    })
        .then(dbRoutingData => {
            dbRoutingData.forEach(entry => {
                if (req.body.includes(entry.origin)) {
                    promises.push(
                        Routing.update({
                            travel_allowed: 1
                        }, {
                            where: {
                                routing_id: entry.routing_id
                            }
                        }
                        ))
                } else {
                    promises.push(
                        Routing.update({
                            travel_allowed: 0
                        }, {
                            where: {
                                routing_id: entry.routing_id
                            }
                        }
                        ))
                }
                Promise.all(promises)
                    .then(response => {
                        res.json(response)
                    })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

module.exports = router;