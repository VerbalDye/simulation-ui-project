const router = require('express').Router();
const { CurrentlyRunning, ExperimentInfo, Log } = require('../../../models');
const fs = require('fs');

router.post('/start/:id', (req, res) => {
    var child_process = require('child_process');
    Promise.allSettled([
        new Promise(resolve => {
            ExperimentInfo.create({
                experiment_id: req.params.id
            })
                .then(dbExperimentInfoData => resolve())
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        }),
        new Promise(resolve => {
            CurrentlyRunning.create({
                experiment_id: req.params.id
            })
                .then(dbCurrentlyRunningData => resolve())
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        })
    ])
        .then(dbPromiseData => {
            child_process.exec('..\\simulation\\"PV_Fluid v0_35 (Random seed depending on replication)_windows.bat"', {maxBuffer: 1024 * 1024 * 200}, async function (error, stdout, stderr) {
                console.log(stdout);
                console.log(error);
                let info = stdout;
                if (!info) { info = error }
                if (!info) { info = stderr }
                let body = { experiment_id: req.params.id, info: info }
                let logData = await Log.findOne({ where: { experiment_id: req.params.id }})
                if (logData) {
                    Log.update(body, { where: { log_id: logData.log_id }});
                } else {
                    Log.create(body);
                }
                await CurrentlyRunning.destroy({ where: { experiment_id: req.params.id }})
                res.status(200).json({ message: stdout })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

module.exports = router;