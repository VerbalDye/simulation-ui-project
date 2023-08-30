const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { ExperimentSite } = require('../../../models');

router.get('/', (req, res) => {
    ExperimentSite.findAll()
        .then(dbExperimentSiteData => res.json(dbExperimentSiteData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    ExperimentSite.findOne({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentSiteData => res.json(dbExperimentSiteData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    ExperimentSite.update(req.body, {
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbExperimentSiteData => res.json(dbExperimentSiteData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;