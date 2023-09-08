const router = require('express').Router();
const { ExperimentInfo } = require('../../../models');

router.post('/start/:id', (req, res) => {
    var child_process = require('child_process');
    ExperimentInfo.create({
        experiment_id: req.params.id,
        num_replications: 3
    })
        .then(dbExperimentInfoData => {
            child_process.exec('..\\simulation\\"PV_Fluid v0_5_4 (parts move to end)_windows.bat"', function (error, stdout, stderr) {
                console.log(stdout);
                console.log(error);
                res.status(200).json({ message: stdout })
            });
        })
})

module.exports = router;