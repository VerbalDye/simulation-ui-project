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
            const simulationProcess = child_process.exec('..\\simulation\\"PV_Fluid v0_39 (Enhanced bartel release)_windows.bat"', {maxBuffer: 1024 * 1024 * 200})
            let simProcessOut;
            simulationProcess.stdout.on('data', (data) => {
                console.log(data);
                simProcessOut += "\n" + data;
                if (data.includes("Press any key to continue")) {
                    simulationProcess.stdin.write("A");
                }
            });
            simulationProcess.on('close', async (code) => {
                console.log(code);
                let body = { experiment_id: req.params.id, info: simProcessOut }
                let logData = await Log.findOne({ where: { experiment_id: req.params.id }})
                if (logData) {
                    Log.update(body, { where: { log_id: logData.log_id }});
                } else {
                    Log.create(body);
                }
                await CurrentlyRunning.destroy({ where: { experiment_id: req.params.id }})
                res.status(200).json({ message: code })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

module.exports = router;