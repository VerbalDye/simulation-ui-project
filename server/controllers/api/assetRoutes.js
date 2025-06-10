const router = require('express').Router();
const { Asset } = require('../../models');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
    Asset.findAll()
        .then(dbAssetData => res.json(dbAssetData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// router.get('/building/:id', (req, res) => {
//     Asset.findAll(req.params.id)
//         .then(dbAssetData => res.json(dbAssetData))
//         .catch(err => {
//             console.log(err);
//             res.status(400).json(err);
//         });
// })

router.post('/create-bulk', (req, res) => {
    Asset.bulkCreate(req.body)
        .then(dbAssetData => res.json(dbAssetData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.post('/create-default', (req, res) => {
    sequelize.query('CALL add_newAsset (:aname, :atype, :x, :y, :z, :l, :w, :h, :capacity, :op_id, :proc_time, :fromList, :fromTime, :toList, :toTime)',
    {
        replacements: req.body
    })
        .then(dbResponse => res.json({ message: 'Success' }))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.put('/:id', (req, res) => {
    Asset.update(req.body, {
        where: {
            asset_id: req.params.id
        }
    })
        .then(dbAssetData => {
            if (!dbAssetData[0]) {
                res.status(404).json({ message: 'No asset found with this ID' });
                return;
            }
            res.json(dbAssetData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Asset.destroy(req.body, {
        where: {
            asset_id: req.params.id
        }
    })
        .then(dbAssetData => {
            if (!dbAssetData[0]) {
                res.status(404).json({ message: 'No asset found with this ID' });
                return;
            }
            res.json(dbAssetData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

module.exports = router;