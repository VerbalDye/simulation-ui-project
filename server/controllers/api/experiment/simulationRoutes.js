const router = require('express').Router();
const { CurrentlyRunning, ExperimentInfo, Log } = require('../../../models');
const fs = require('fs');


// router.post('/start/:id', (req, res) => {
//     var child_process = require('child_process');
//     Promise.allSettled([
//         new Promise(resolve => {
//             ExperimentInfo.create({
//                 experiment_id: req.params.id
//             })
//                 .then(dbExperimentInfoData => resolve())
//                 .catch(err => {
//                     console.log(err);
//                     res.status(400).json(err);
//                 });
//         }),
//         new Promise(resolve => {
//             CurrentlyRunning.create({
//                 experiment_id: req.params.id
//             })
//                 .then(dbCurrentlyRunningData => resolve())
//                 .catch(err => {
//                     console.log(err);
//                     res.status(400).json(err);
//                 });
//         })
//     ])
//         .then(dbPromiseData => {
//             const simulationProcess = child_process.exec('..\\simulation\\"PV_Fluid v0_40 (Line crossing)_windows.bat"', {maxBuffer: 1024 * 1024 * 200})
//             let simProcessOut;
//             simulationProcess.stdout.on('data', (data) => {
//                 console.log(data);
//                 simProcessOut += "\n" + data;
//                 if (data.includes("Press any key to continue")) {
//                     simulationProcess.stdin.write("A");
//                 }
//             });
//             simulationProcess.on('close', async (code) => {
//                 console.log(code);
//                 let body = { experiment_id: req.params.id, info: simProcessOut }
//                 let logData = await Log.findOne({ where: { experiment_id: req.params.id }})
//                 if (logData) {
//                     Log.update(body, { where: { log_id: logData.log_id }});
//                 } else {
//                     Log.create(body);
//                 }
//                 await CurrentlyRunning.destroy({ where: { experiment_id: req.params.id }})
//                 res.status(200).json({ message: code })
//             })
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// })


router.post('/start/:id', (req, res) => {
    let body = {
        "experimentType": "SIMULATION",
        "inputs": [
            {
                "name": "EXPERIMENT_ID",
                "type": "INTEGER",
                "units": null,
                "value": req.params.id
            },
            {
                "name": "DATABASE_CONNECTION_URL",
                "type": "STRING",
                "units": null,
                "value": "jdbc:mysql://address=(host=172.28.0.56)(port=3306)(user=PVFAdmin)(password=1)/pvfluid_test"
            }
        ]
    }
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
            fetch(url, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': process.env.ANYLOGIC_CLOUD_KEY,
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(body), // body data type must match "Content-Type" header
            }).then(result => {
                res.status(200).json(result);
            })
        })
})

module.exports = router;