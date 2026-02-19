const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class LaborUtilization extends Model {};

LaborUtilization.init(
    {
        labor_utilization_id: {
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
            allowNull: false
        },
        replication: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        priority_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        job_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        asset_name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        operator_name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        time_of_assignment: {
            type: DataTypes.DATE,
            allowNull:false
        },
        dt: {
            type: DataTypes.DOUBLE,
            allowNull:false
        },
        backlog: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        priority: {
            type: DataTypes.DOUBLE,
            allowNull:false
        },
        worker_status: {
            type: DataTypes.STRING,
            allowNull:false
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'labor_utilization',
        timestamps: false
    }
)

module.exports = LaborUtilization;