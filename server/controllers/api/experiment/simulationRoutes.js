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
router.get('/status/:id', async (req, res) => {
    let url = "http://172.28.0.58/api/open/8.5.0/versions/" + process.env.VERSION_ID + "/run";
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
                "name": "ITERATION_ID",
                "type": "INTEGER",
                "units": null,
                "value": 1
            },
            {
                "name": "DATABASE_CONNECTION_URL",
                "type": "STRING",
                "units": null,
                "value": "jdbc:mysql://address=(host=172.28.0.56)(port=3306)(user=" + process.env.DB_USER + ")(password=" + process.env.DB_PW + ")/" + process.env.DB_NAME
            },
            {
                "name": "{MAX_MEMORY_MB}",
                "type": "INTEGER",
                "units": null,
                "value": "2048"
            }
        ]
    }
        let result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': process.env.ANYLOGIC_CLOUD_KEY,
            },
            body: JSON.stringify(body),
        })
        let json = await result.json();
        console.log(json);
        res.status(200).json(json);
})

router.post('/start/:id', async (req, res) => {
    let url = "http://172.28.0.58/api/open/8.5.0/versions/" + process.env.VERSION_ID + "/runs";
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
                "name": "ITERATION_ID",
                "type": "INTEGER",
                "units": null,
                "value": 1
            },
            {
                "name": "DATABASE_CONNECTION_URL",
                "type": "STRING",
                "units": null,
                "value": "jdbc:mysql://address=(host=172.28.0.56)(port=3306)(user=" + process.env.DB_USER + ")(password=" + process.env.DB_PW + ")/" + process.env.DB_NAME
            },
            {
                "name": "{MAX_MEMORY_MB}",
                "type": "INTEGER",
                "units": null,
                "value": "2048"
            }
        ]
    }
    let body2 = structuredClone(body);
    body2.inputs[1].value = 0
    let responses = await Promise.allSettled([
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': process.env.ANYLOGIC_CLOUD_KEY,
            },
            body: JSON.stringify(body)
        }),
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': process.env.ANYLOGIC_CLOUD_KEY,
            },
            body: JSON.stringify(body2)
        })
    ]);
    console.log(responses);
    if (responses[0].ok && responses[1].ok) { 
        res.status(200).json(json);
    } else {
        res.status(400);
    }
})

module.exports = router;