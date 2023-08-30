const { Sessions } = require('../models');

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

module.exports = withAuth;

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