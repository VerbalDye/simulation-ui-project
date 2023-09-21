const router = require('express').Router();
const sequelize = require('../../../config/connection');
const { AssetAvailability } = require('../../../models');

router.get('/', (req, res) => {
    AssetAvailability.findAll()
        .then(dbAssetAvailabilityData => res.json(dbAssetAvailabilityData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    AssetAvailability.findAll({
        where: {
            experiment_id: req.params.id
        }
    })
        .then(dbAssetAvailabilityData => res.json(dbAssetAvailabilityData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.put('/:id', (req, res) => {
//     AssetAvailability.update(req.body, {
//         where: {
//             experiment_phases_id: req.params.id
//         }
//     })
//         .then(dbAssetAvailabilityData => res.json(dbAssetAvailabilityData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// });

module.exports = router;