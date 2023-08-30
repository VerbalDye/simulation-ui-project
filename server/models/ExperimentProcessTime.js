const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentProcessTime extends Model {};

ExperimentProcessTime.init(
    {
        experiment_process_time_id: {
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
        process_time_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'process_time',
                key: 'process_time_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_process_time',
        timestamps: false
    }
)

module.exports = ExperimentProcessTime;