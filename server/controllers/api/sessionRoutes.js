const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Sessions, Users } = require('../../models');

router.get('/', (req, res) => {
    Sessions.findOne({
        where: {
            session_token: req.cookies.session_token
        },
        attributes: { exclude: ['session_key'] },
        include: [{
            model: Users,
            attributes: { exclude: ['password'] }
        }]
    })
        .then(dbSessionsData => res.json(dbSessionsData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;