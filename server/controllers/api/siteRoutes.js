const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Site } = require('../../models');

router.get('/', (req, res) => {
    Site.findAll()
        .then(dbSiteData => res.json(dbSiteData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;