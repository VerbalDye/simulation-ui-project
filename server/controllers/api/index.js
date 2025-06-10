const router = require('express').Router();
const { withAuth } = require('../../utils/auth');

const assetRoutes = require('./assetRoutes');
const coreModelRoutes = require('./coreModelRoutes');
const experimentRoutes = require('./experiment');
const hoursOfOperationRoutes = require('./hoursOfOperationRoutes');
const modelRoutes = require('./modelRoutes');
const operationRoutes = require('./operationRoutes');
const processTimeRoutes = require('./processTimeRoutes');
const routingRoutes = require('./routingRoutes');
const scenarioRoutes = require('./scenarioRoutes');
const siteRoutes = require('./siteRoutes');
const userRoutes = require('./userRoutes');

const sessionsRoutes = require('./sessionRoutes');

router.use('/asset', withAuth, assetRoutes);
router.use('/core-model', withAuth, coreModelRoutes);
router.use('/experiment', withAuth, experimentRoutes);
router.use('/hours-of-operation', withAuth, hoursOfOperationRoutes);
router.use('/model', withAuth, modelRoutes);
router.use('/operation', withAuth, operationRoutes);
router.use('/process-time', withAuth, processTimeRoutes);
router.use('/routing', withAuth, routingRoutes);
router.use('/scenario', withAuth, scenarioRoutes);
router.use('/session', withAuth, sessionsRoutes);
router.use('/site', withAuth, siteRoutes);
router.use('/user', userRoutes);

module.exports = router;