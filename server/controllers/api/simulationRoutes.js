const router = require('express').Router();

router.post('/start', (req, res) => {
    // if (req.session.loggedIn) {
        var child_process = require('child_process');

        child_process.exec('..\\simulation\\"PV_Fluid v0_5_4 (parts move to end)_windows.bat"', function (error, stdout, stderr) {
            console.log(stdout);
            console.log(error);
            res.status(200).json({ message: stdout })
        });
    // } else {
    //     res.status(404).end();
    // }
})

module.exports = router;