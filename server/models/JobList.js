const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class JobList extends Model {};

JobList.init(
    {
        job_list_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        experiment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'experiment',
                key: 'experiment_id'
            }
        },
        job_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        iteration_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        replication: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        model_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'model',
                key: 'model_number'
            }
        },
        job_mix_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'job_mix',
                key: 'job_mix_id'
            }
        },
        start: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        current_task: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operation',
                key: 'operation_id'
            }
        },
        need_transit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        transit_type: {
            type: DataTypes.ENUM('AGV', 'CONVEYOR', 'CRANE', 'WORKER', 'TIME')
        },
        resource_type: {
            type: DataTypes.ENUM('CORE', 'TOOL', 'MATERIAL', 'WORKER')
        },
        next_task: {
            type: DataTypes.INTEGER,
            references: {
                model: 'operation',
                key: 'operation_id'
            }
        },
        resource_keep: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        qc_pass: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        last_modified: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'job_list',
        timestamps: false
    }
)

module.exports = JobList;