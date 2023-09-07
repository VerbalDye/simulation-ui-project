const router = require('express').Router();

const experimentRoutes = require('./experimentRoutes');
const assetRoutes = require('./assetRoutes');
const backlogRoutes = require('./backlogRoutes');
const hoursOfOperationRoutes = require('./hoursOfOperationRoutes');
const jobListRoutes = require('./jobListRoutes');
const jobMixRoutes = require('./jobMixRoutes');
const operationToLocationRoutes = require('./operationToLocation');
const phasesRoutes = require('./phasesRoutes');
const processTimeRoutes = require('./processTimeRoutes');
const routingRoutes = require('./routingRoutes');
const siteRoutes = require('./siteRoutes');
const taskSequenceRoutes = require('./taskSequenceRoutes');

router.use('/', experimentRoutes);
router.use('/asset', assetRoutes);
router.use('/backlog', backlogRoutes);
router.use('/hours-of-operation', hoursOfOperationRoutes);
router.use('/job-list', jobListRoutes);
router.use('/job-mix', jobMixRoutes);
router.use('/operation-to-location', operationToLocationRoutes);
router.use('/phases', phasesRoutes);
router.use('/process-time', processTimeRoutes);
router.use('/routing', routingRoutes);
router.use('/site', siteRoutes);
router.use('/task-sequence', taskSequenceRoutes);

module.exports = router;