const router = require('express').Router();

const experimentRoutes = require('./experimentRoutes');
const arrivalRoutes = require('./arrivalRoutes');
const assetRoutes = require('./assetRoutes');
const assetAvailabilityRoutes = require('./assetAvailabilityRoutes');
const backlogRoutes = require('./backlogRoutes');
const hoursOfOperationRoutes = require('./hoursOfOperationRoutes');
const jobListRoutes = require('./jobListRoutes');
const jobMixRoutes = require('./jobMixRoutes');
const operationToLocationRoutes = require('./operationToLocation');
const phasesRoutes = require('./phasesRoutes');
const processTimeRoutes = require('./processTimeRoutes');
const resourceUtilizationRoutes = require('./resourceUtilizationRoutes')
const routingRoutes = require('./routingRoutes');
const simulationRoutes = require('./simulationRoutes');
const siteRoutes = require('./siteRoutes');
const taskSequenceRoutes = require('./taskSequenceRoutes');
const throughputRoutes = require('./throughputRoutes');

router.use('/', experimentRoutes);
router.use('/arrival', arrivalRoutes);
router.use('/asset', assetRoutes);
router.use('/asset-availability', assetAvailabilityRoutes);
router.use('/backlog', backlogRoutes);
router.use('/hours-of-operation', hoursOfOperationRoutes);
router.use('/job-list', jobListRoutes);
router.use('/job-mix', jobMixRoutes);
router.use('/operation-to-location', operationToLocationRoutes);
router.use('/phases', phasesRoutes);
router.use('/process-time', processTimeRoutes);
router.use('/resource-util', resourceUtilizationRoutes);
router.use('/routing', routingRoutes);
router.use('/simulation', simulationRoutes);
router.use('/site', siteRoutes);
router.use('/task-sequence', taskSequenceRoutes);
router.use('/throughput', throughputRoutes);

module.exports = router;