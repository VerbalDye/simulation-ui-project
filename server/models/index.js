const Asset = require('./Asset');
const Cell = require('./Cell');
const Core = require('./Core');
const CoreModel = require('./CoreModel');
const CoreSoakTime = require('./CoreSoakTime');
const Experiment = require('./Experiment');
const ExperimentAsset = require('./ExperimentAsset');
const ExperimentCoreSoakTime = require('./ExperimentCoreSoakTime');
const ExperimentHoo = require('./ExperimentHoo');
const ExperimentJobMix = require('./ExperimentJobMix');
const ExperimentOpToLoc = require('./ExperimentOpToLoc');
const ExperimentProcessTime = require('./ExperimentProcessTime');
const ExperimentRouting = require('./ExperimentRouting');
const ExperimentSite = require('./ExperimentSite');
const ExperimentTaskSequence = require('./ExperimentTaskSequence');
const HoursOfOperation = require('./HoursOfOperation');
const JobCore = require('./JobCore');
const JobLocation = require('./JobLocation');
const JobMix = require('./JobMix');
const ModelObject = require('./Model');
const Operation = require('./Operation');
const OperationToLocation = require('./OperationToLocation');
const Phases = require('./Phases');
const ProcessTime = require('./ProcessTime');
const Routing = require('./Routing');
const Scenario = require('./Scenario');
const ScenarioFilter = require('./ScenarioFilter');
const Sessions = require('./Sessions');
const Site = require('./Site');
const TaskSequence = require('./TaskSequence');
const Users = require('./Users');

// Core-Model Associations
ModelObject.hasMany(CoreModel, {
    foreignKey: 'model_number'
});
CoreModel.belongsTo(ModelObject, {
    foreignKey: 'model_number'
});
Core.hasMany(CoreModel, {
    foreignKey: 'core_number'
});
CoreModel.belongsTo(Core, {
    foreignKey: 'core_number'
});
ModelObject.hasMany(Core, {
    foreignKey: 'model_number'
});
Core.belongsTo(ModelObject, {
    foreignKey: 'model_number'
});
ModelObject.hasMany(CoreSoakTime, {
    foreignKey: 'model_number'
});
CoreSoakTime.belongsTo(ModelObject, {
    foreignKey: 'model_number'
});
Core.hasMany(CoreSoakTime, {
    foreignKey: 'core_number'
});
CoreSoakTime.belongsTo(Core, {
    foreignKey: 'core_number'
});

// Hours-Site
Site.hasMany(HoursOfOperation, {
    foreignKey: 'site_id'
});
HoursOfOperation.belongsTo(Site, {
    foreignKey: 'site_id',
    onDelete: 'CASCADE'
});

// Operation-Asset
Operation.hasMany(OperationToLocation, {
    foreignKey: 'operation_id'
});
OperationToLocation.belongsTo(Operation, {
    foreignKey: 'operation_id',
    onDelete: 'CASCADE'
});
Asset.hasMany(OperationToLocation, {
    foreignKey: 'asset_id'
});
OperationToLocation.belongsTo(Asset, {
    foreignKey: 'asset_id'
});
Operation.hasMany(ProcessTime, {
    foreignKey: 'operation_id'
});
ProcessTime.belongsTo(Operation, {
    foreignKey: 'operation_id',
    onDelete: 'CASCADE'
});


// Processing Time-Asset
Asset.hasMany(ProcessTime, {
    foreignKey: 'asset_id'
});
ProcessTime.belongsTo(Asset, {
    foreignKey: 'asset_id',
    onDelete: 'CASCADE'
});

// Asset-Routing
Asset.belongsToMany(Asset, {
    through: Routing,
    foreignKey: 'origin',
    otherKey: 'destination',
    as: 'destinations'
});

// Operation-Task Sequence
Cell.hasMany(TaskSequence, {
    foreignKey: 'cell_id'
});
TaskSequence.belongsTo(Cell, {
    foreignKey: 'cell_id',
    onDelete: 'CASCADE'
});

// Operation-Task Sequence
Phases.hasMany(TaskSequence, {
    foreignKey: 'phase_id'
});
TaskSequence.belongsTo(Phases, {
    foreignKey: 'phase_id',
    onDelete: 'CASCADE'
});

// Operation-Task Sequence
Operation.hasMany(TaskSequence, {
    foreignKey: 'operation_id'
});
TaskSequence.belongsTo(Operation, {
    foreignKey: 'operation_id',
    onDelete: 'CASCADE'
});

// Scenario-Filter
Scenario.hasMany(ScenarioFilter, {
    foreignKey: 'scenario_id'
});
ScenarioFilter.belongsTo(Scenario, {
    foreignKey: 'scenario_id',
    onDelete: 'CASCADE'
});

// User-Session Associations
Users.hasOne(Sessions, {
    foreignKey: 'user_id'
});
Sessions.belongsTo(Users, {
    foreignKey: 'user_id'
});

// User-Experiment Associations
Users.hasMany(Experiment, {
    foreignKey: 'user_id'
});
Experiment.belongsTo(Users, {
    foreignKey: 'user_id'
});

// Experiment-Asset Associations
Experiment.hasMany(ExperimentAsset, {
    foreignKey: 'experiment_id'
});
ExperimentAsset.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
Asset.hasMany(ExperimentAsset, {
    foreignKey: 'asset_id'
});
ExperimentAsset.belongsTo(Asset, {
    foreignKey: 'asset_id'
});

// Experiment-CoreSoakTime
Experiment.hasMany(ExperimentCoreSoakTime, {
    foreignKey: 'experiment_id'
});
ExperimentCoreSoakTime.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
CoreSoakTime.hasMany(ExperimentCoreSoakTime, {
    foreignKey: 'core_soak_time_id'
});
ExperimentCoreSoakTime.belongsTo(CoreSoakTime, {
    foreignKey: 'core_soak_time_id'
});

// Experiment-CoreSoakTime
Experiment.hasMany(ExperimentHoo, {
    foreignKey: 'experiment_id'
});
ExperimentHoo.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
HoursOfOperation.hasMany(ExperimentHoo, {
    foreignKey: 'hours_of_operation_id'
});
ExperimentHoo.belongsTo(HoursOfOperation, {
    foreignKey: 'hours_of_operation_id'
});

// Experiment-JobMix
Experiment.hasMany(ExperimentJobMix, {
    foreignKey: 'experiment_id'
});
ExperimentJobMix.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
JobMix.hasMany(ExperimentJobMix, {
    foreignKey: 'job_mix_id'
});
ExperimentJobMix.belongsTo(JobMix, {
    foreignKey: 'job_mix_id'
});

// Experiment-OperationToLocation
Experiment.hasMany(ExperimentOpToLoc, {
    foreignKey: 'experiment_id'
});
ExperimentOpToLoc.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
OperationToLocation.hasMany(ExperimentOpToLoc, {
    foreignKey: 'operation_to_location_id'
});
ExperimentOpToLoc.belongsTo(OperationToLocation, {
    foreignKey: 'operation_to_location_id'
});

// Experiment-ProcessTime
Experiment.hasMany(ExperimentProcessTime, {
    foreignKey: 'experiment_id'
});
ExperimentProcessTime.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
ProcessTime.hasMany(ExperimentProcessTime, {
    foreignKey: 'process_time_id'
});
ExperimentProcessTime.belongsTo(ProcessTime, {
    foreignKey: 'process_time_id'
});

Experiment.hasMany(ExperimentRouting, {
    foreignKey: 'experiment_id'
});
ExperimentRouting.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
Routing.hasMany(ExperimentRouting, {
    foreignKey: 'routing_id'
});
ExperimentRouting.belongsTo(Routing, {
    foreignKey: 'routing_id'
});

// Experiment-Scenario
Experiment.hasOne(Scenario, {
    foreignKey: 'experiment_id'
});
Scenario.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
Experiment.belongsTo(Scenario, {
    foreignKey: 'scenario_id'
});
Scenario.hasMany(Experiment, {
    foreignKey: 'scenario_id',
    onDelete: 'CASCADE'
});

// Experiment-Site
Experiment.hasOne(ExperimentSite, {
    foreignKey: 'experiment_id'
});
ExperimentSite.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
Site.hasMany(ExperimentSite, {
    foreignKey: 'site_id'
});
ExperimentSite.belongsTo(Site, {
    foreignKey: 'site_id'
});

// Experiment-TaskSequence
Experiment.hasMany(ExperimentTaskSequence, {
    foreignKey: 'experiment_id'
});
ExperimentTaskSequence.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
TaskSequence.hasMany(ExperimentTaskSequence, {
    foreignKey: 'task_sequence_id'
});
ExperimentTaskSequence.belongsTo(TaskSequence, {
    foreignKey: 'task_sequence_id'
});

module.exports = { 
    Asset,
    Cell,
    Core,
    CoreModel,
    CoreSoakTime,
    Experiment,
    ExperimentAsset,
    ExperimentCoreSoakTime,
    ExperimentHoo,
    ExperimentJobMix,
    ExperimentOpToLoc,
    ExperimentProcessTime,
    ExperimentRouting,
    ExperimentSite,
    ExperimentTaskSequence,
    HoursOfOperation,
    JobCore,
    JobLocation,
    JobMix,
    ModelObject,
    Operation,
    OperationToLocation,
    Phases,
    ProcessTime,
    Routing,
    Scenario,
    ScenarioFilter,
    Sessions,
    Site,
    TaskSequence,
    Users
};