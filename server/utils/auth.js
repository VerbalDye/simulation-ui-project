const { Sessions, Users } = require('../models');

const withAuth = (req, res, next) => {
    const session_token = req.cookies["session_token"]
    if (!session_token) {
        res.redirect('/welcome?redirect=' + encodeURIComponent(req.originalUrl));
    } else {
        Sessions.findOne({
            where: {
                session_token: session_token
            }
        }).then(dbSessionData => {
            if (dbSessionData) {
                let expired = new Date(dbSessionData.expires_at) < new Date();
                if (!expired) {
                    next();
                } else {
                    Sessions.destroy({
                        where: {
                            user_id: dbSessionData.user_id
                        }
                    });
                    res.redirect('/welcome?redirect=' + encodeURIComponent(req.originalUrl));
                }
            } else {
                res.redirect('/welcome?redirect=' + encodeURIComponent(req.originalUrl));
            }
        })
    }
};

const withAdminAuth = (req, res, next) => {
    const session_token = req.cookies["session_token"]
    if (!session_token) {
        res.status(401).json({ message: 'No credentials identified. Try signing in.' });
    } else {
        Sessions.findOne({
            where: {
                session_token: session_token
            },
            include: [{
                model: Users,
                attributes: { exclude: ['password'] },
            }]
        }).then(dbSessionData => {
            console.log(dbSessionData.users);
            if (dbSessionData) {
                if (dbSessionData.user.role == 'admin') {
                    next();
                } else {
                    res.status(403).json({ message: 'User does not have the correct access rights.'});
                }
            } else {
                res.status(401).json({ message: 'No credentials identified. Try signing in.' });
            }
        })
    }
}

module.exports = { withAuth, withAdminAuth };

// const jwt = require('jsonwebtoken');

// const secret = 'thisisasecret';
// const expiration = '2h';

// module.exports = {
//     signToken: function({ email, id }) {
//         const payload = { email, id };

//         return jwt.sign({ data: payload }, secret, {expiresIn: expiration });
//     },

//     authMiddleware: function({ req }) {
//         let token = req.body.token || req.query.token || req.headers.authorization;

//         if (req.headers.authorization) {
//             token = token
//                 .split(' ')
//                 .pop()
//                 .trim();
//         }

//         if (!token) {
//             return req;
//         }

//         try {
//             const { data } = jwt.verify(token, secret, { maxAge: expiration });
//             req.user = data;
//         } catch {
//             console.log('Invalid Token');
//         }

//         return req;
//     }
// };