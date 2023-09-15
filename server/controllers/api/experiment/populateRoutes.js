const router = require('express').Router();
const sequelize = require('../../../config/connection');

router.post('/from-ui', (req, res) => {
    console.log(req.body);
    sequelize.query('CALL populate_fromUI (:expId, :numReplications, :start_date, :min_jobs, :max_jobs, :stators, :relines, :rnd, :sun, :mon, :tues, :wed, :thur, :fri, :sat, :sun_time, :mon_time, :tues_time, :wed_time, :thur_time, :fri_time, :sat_time)',
    {
        replacements: req.body
    })
        .then(dbResponse => res.json({ message: 'Success' }))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.post('/from-backlog', (req, res) => {
    console.log(req.body);
    sequelize.query('CALL populate_fromBacklog (:expId, :numReplications)',
    {
        replacements: req.body
    })
        .then(dbResponse => res.json({ message: 'Success' }))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.post('/jobs', (req, res) => {
    console.log(req.body);
    sequelize.query('CALL populate_jobs (:expId)', { replacements: req.body})
        .then(dbResponse => res.json({ message: 'Success' }))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

module.exports = router;