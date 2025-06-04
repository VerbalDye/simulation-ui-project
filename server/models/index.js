const Arrival = require('./Arrival');
const Asset = require('./Asset');
const AssetAvailability = require('./AssetAvailability');
const Backlog = require('./Backlog');
const Cell = require('./Cell');
const Core = require('./Core');
const CoreModel = require('./CoreModel');
const CoreSoakTime = require('./CoreSoakTime');
const CurrentlyRunning = require('./CurrentlyRunning');
const Downtime = require('./Downtime');
const Experiment = require('./Experiment');
const ExperimentAsset = require('./ExperimentAsset');
const ExperimentCore = require('./ExperimentCore');
const ExperimentCoreSoakTime = require('./ExperimentCoreSoakTime');
const ExperimentDowntime = require('./ExperimentDowntime');
const ExperimentGoal = require('./ExperimentGoal');
const ExperimentHoo = require('./ExperimentHoo');
const ExperimentInfo = require('./ExperimentInfo');
const ExperimentJobMix = require('./ExperimentJobMix');
const ExperimentOpToLoc = require('./ExperimentOpToLoc');
const ExperimentProcessTime = require('./ExperimentProcessTime');
const ExperimentRouting = require('./ExperimentRouting');
const ExperimentSite = require('./ExperimentSite');
const ExperimentTaskSequence = require('./ExperimentTaskSequence');
const ExperimentTimeDistribution = require('./ExperimentTimeDistribution');
const ExperimentTimeType = require('./ExperimentTimeType');
const HoursOfOperation = require('./HoursOfOperation');
const JobCore = require('./JobCore');
const JobList = require('./JobList');
const JobLocation = require('./JobLocation');
const JobMix = require('./JobMix');
const Log = require('./Log');
const ModelObject = require('./Model');
const Operation = require('./Operation');
const OperationToLocation = require('./OperationToLocation');
const Phases = require('./Phases');
const ProcessTime = require('./ProcessTime');
const ProcessTimeDistribution = require('./ProcessTimeDistribution');
const ResourceUtilization = require('./ResourceUtilization');
const Routing = require('./Routing');
const Scenario = require('./Scenario');
const ScenarioFilter = require('./ScenarioFilter');
const Sessions = require('./Sessions');
const Site = require('./Site');
const TaskSequence = require('./TaskSequence');
const Throughput = require('./Throughput');
const Users = require('./Users');

// Asset Availability-Asset
Asset.hasMany(AssetAvailability, {
    foreignKey: 'asset_id'
});
AssetAvailability.belongsTo(Asset, {
    foreignKey: 'asset_id',
    onDelete: 'CASCADE'
});

//Asset-Downtime
Asset.hasMany(Downtime, {
    foreignKey: 'asset_id'
});
Downtime.belongsTo(Asset, {
    foreignKey: 'asset_id',
    onDelete: 'CASCADE'
});

// Backlog- Model Association
ModelObject.hasMany(Backlog, {
    foreignKey: 'model_number'
});
Backlog.belongsTo(ModelObject, {
    foreignKey: 'model_number',
    onDelete: 'CASCADE'
});

// Core-Model Associations
ModelObject.hasMany(CoreModel, {
    foreignKey: 'model_number'
});
CoreModel.belongsTo(ModelObject, {
    foreignKey: 'model_number'
});
Core.hasOne(CoreModel, {
    foreignKey: 'core_number'
});
CoreModel.belongsTo(Core, {
    foreignKey: 'core_number'
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

// JobList associations
ModelObject.hasMany(JobList, {
    foreignKey: 'model_number'
});
JobList.belongsTo(ModelObject, {
    foreignKey: 'model_number'
});
Operation.hasMany(JobList, {
    foreignKey: 'current_task'
});
JobList.belongsTo(Operation, {
    foreignKey: 'current_task'
});
Operation.hasMany(JobList, {
    foreignKey: 'next_task'
});
JobList.belongsTo(Operation, {
    foreignKey: 'next_task'
});
JobMix.hasMany(JobList, {
    foreignKey: 'job_mix_id'
});
JobList.belongsTo(JobMix, {
    foreignKey: 'job_mix_id'
});
JobLocation.belongsTo(Operation, {
    foreignKey: 'operation_id'
});
Operation.hasMany(JobLocation, {
    foreignKey: 'operation_id'
});
JobLocation.belongsTo(Asset, {
    foreignKey: 'asset_id'
});
Asset.hasMany(JobLocation, {
    foreignKey: 'asset_id'
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
// Asset.belongsToMany(Asset, {
//     through: Routing,
//     foreignKey: 'origin',
//     otherKey: 'destination',
//     as: 'destinations'
// });
// Asset.hasMany(Routing, {
//     foreignKey: 'asset_id',
//     as: 'origin',
// });
// Asset.hasMany(Routing, {
//     foreignKey: 'asset_id',
//     as: 'destination'
// });
Routing.belongsTo(Asset, {
    foreignKey: 'origin',
    as: 'origin_asset',
    onDelete: 'CASCADE'
});
Routing.belongsTo(Asset, {
    foreignKey: 'destination',
    as: 'destination_asset',
    onDelete: 'CASCADE'
});

// Resource Utilization-Asset
Asset.hasMany(ResourceUtilization, {
    foreignKey: 'asset_id'
});
ResourceUtilization.belongsTo(Asset, {
    foreignKey: 'asset_id',
    onDelete: 'CASCADE'
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

// Experiment-Asset Availability Associations
Experiment.hasMany(AssetAvailability, {
    foreignKey: 'experiment_id'
});
AssetAvailability.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment-Backlog Association
Experiment.hasMany(Backlog, {
    foreignKey: 'experiment_id'
});
Backlog.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment-Core
Experiment.hasMany(ExperimentCore, {
    foreignKey: 'experiment_id'
});
ExperimentCore.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
Core.hasMany(ExperimentCore, {
    foreignKey: 'core_number'
});
ExperimentCore.belongsTo(Core, {
    foreignKey: 'core_number'
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

// Experiment Currently Running
Experiment.hasMany(CurrentlyRunning, {
    foreignKey: 'experiment_id'
});
CurrentlyRunning.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment Downtime
Experiment.hasMany(ExperimentDowntime, {
    foreignKey: 'experiment_id'
});
ExperimentDowntime.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
Downtime.hasMany(ExperimentDowntime, {
    foreignKey: 'asset_downtime_id'
});
ExperimentDowntime.belongsTo(Downtime, {
    foreignKey: 'asset_downtime_id',
    onDelete: 'CASCADE'
});

// Experiment-Goal
Experiment.hasMany(ExperimentGoal, {
    foreignKey: 'experiment_id'
});
ExperimentGoal.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment-Hours of Operation
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

// Experiment-Info
Experiment.hasMany(ExperimentInfo, {
    foreignKey: 'experiment_id'
});
ExperimentInfo.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment-JobCore
Experiment.hasMany(JobCore, {
    foreignKey: 'experiment_id'
});
JobCore.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment-JobList
Experiment.hasMany(JobList, {
    foreignKey: 'experiment_id'
});
JobList.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
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

// Experiment-Log
Experiment.hasMany(Log, {
    foreignKey: 'experiment_id'
});
Log.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
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

// Experiment-Resource Utilization
Experiment.hasMany(ResourceUtilization, {
    foreignKey: 'experiment_id'
});
ResourceUtilization.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment-Routing
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

// Experiment-TimeDistribution
Experiment.hasMany(ExperimentTimeDistribution, {
    foreignKey: 'experiment_id'
});
ExperimentTimeDistribution.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
ProcessTimeDistribution.hasMany(ExperimentTimeDistribution, {
    foreignKey: 'process_time_distribution_id'
});
ExperimentTimeDistribution.belongsTo(ProcessTimeDistribution, {
    foreignKey: 'process_time_distribution_id'
});

// Experiment-Throughput
Experiment.hasMany(Throughput, {
    foreignKey: 'experiment_id'
});
Throughput.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});

// Experiment-Time Type
Experiment.hasMany(ExperimentTimeType, {
    foreignKey: 'experiment_id'
});
ExperimentTimeType.belongsTo(Experiment, {
    foreignKey: 'experiment_id',
    onDelete: 'CASCADE'
});
Asset.hasMany(ExperimentTimeType, {
    foreignKey: 'asset_id'
});
ExperimentTimeType.belongsTo(Asset, {
    foreignKey: 'asset_id',
    onDelete: 'CASCADE'
});
Operation.hasMany(ExperimentTimeType, {
    foreignKey: 'operation_id'
});
ExperimentTimeType.belongsTo(Operation, {
    foreignKey: 'operation_id',
    onDelete: 'CASCADE'
});

module.exports = { 
    Arrival,
    Asset,
    AssetAvailability,
    Backlog,
    Cell,
    Core,
    CoreModel,
    CoreSoakTime,
    CurrentlyRunning,
    Downtime,
    Experiment,
    ExperimentAsset,
    ExperimentCore,
    ExperimentCoreSoakTime,
    ExperimentDowntime,
    ExperimentGoal,
    ExperimentHoo,
    ExperimentInfo,
    ExperimentJobMix,
    ExperimentOpToLoc,
    ExperimentProcessTime,
    ExperimentRouting,
    ExperimentSite,
    ExperimentTaskSequence,
    ExperimentTimeDistribution,
    ExperimentTimeType,
    HoursOfOperation,
    JobCore,
    JobList,
    JobLocation,
    JobMix,
    Log,
    ModelObject,
    Operation,
    OperationToLocation,
    Phases,
    ProcessTime,
    ProcessTimeDistribution,
    ResourceUtilization,
    Routing,
    Scenario,
    ScenarioFilter,
    Sessions,
    Site,
    TaskSequence,
    Throughput,
    Users
};