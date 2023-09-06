const router = require('express').Router();
const withAuth = require('../../utils/auth');

const assetRoutes = require('./assetRoutes');
const coreModelRoutes = require('./coreModelRoutes');
const experimentRoutes = require('./experiment');
const hoursOfOperation = require('./hoursOfOperationRoutes');
const scenarioRoutes = require('./scenarioRoutes');
const simulationRoutes = require('./simulationRoutes');
const siteRoutes = require('./siteRoutes');
const userRoutes = require('./userRoutes');

const sessionsRoutes = require('./sessionRoutes');

router.use('/asset', withAuth, assetRoutes);
router.use('/core-model', withAuth, coreModelRoutes);
router.use('/experiment', withAuth, experimentRoutes);
router.use('/hours-of-operation', withAuth, hoursOfOperation);
router.use('/scenario', withAuth, scenarioRoutes);
router.use('/simulation', withAuth, simulationRoutes);
router.use('/site', withAuth, siteRoutes);
router.use('/user', userRoutes);

router.use('/session', withAuth, sessionsRoutes);

module.exports = router;