const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentCoreSoakTime extends Model {};

ExperimentCoreSoakTime.init(
    {
        experiment_core_soak_time_id: {
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
        core_soak_time_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'core_soak_time',
                key: 'core_soak_time_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_core_soak_time',
        timestamps: false
    }
)

module.exports = ExperimentCoreSoakTime;