const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Routing } = require('../../models');

router.get('/', (req, res) => {
    Routing.findAll()
        .then(dbRoutingData => res.json(dbRoutingData))
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
});

module.exports = router;