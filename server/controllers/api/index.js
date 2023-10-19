const router = require('express').Router();
const { withAuth } = require('../../utils/auth');

const assetRoutes = require('./assetRoutes');
const coreModelRoutes = require('./coreModelRoutes');
const experimentRoutes = require('./experiment');
const hoursOfOperationRoutes = require('./hoursOfOperationRoutes');
const operationRoutes = require('./operationRoutes');
const scenarioRoutes = require('./scenarioRoutes');
const siteRoutes = require('./siteRoutes');
const userRoutes = require('./userRoutes');

const sessionsRoutes = require('./sessionRoutes');

router.use('/asset', withAuth, assetRoutes);
router.use('/core-model', withAuth, coreModelRoutes);
router.use('/experiment', withAuth, experimentRoutes);
router.use('/hours-of-operation', withAuth, hoursOfOperationRoutes);
router.use('/operation', withAuth, operationRoutes);
router.use('/scenario', withAuth, scenarioRoutes);
router.use('/session', withAuth, sessionsRoutes);
router.use('/site', withAuth, siteRoutes);
router.use('/user', userRoutes);

module.exports = router;