const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ResourceUtilization extends Model {};

ResourceUtilization.init(
    {
        resource_utilization_id: {
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
        iteration_number: {
            type: DataTypes.INTEGER,
        },
        replication: {
            type: DataTypes.INTEGER
        },
        job_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        task_start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        task_end: {
            type: DataTypes.DATE
        },
        asset_id: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            references: {
                model: 'asset',
                key: 'asset_id'
            }
        },
        processing_time: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'resource_utilization',
        timestamps: false
    }
)

module.exports = ResourceUtilization;