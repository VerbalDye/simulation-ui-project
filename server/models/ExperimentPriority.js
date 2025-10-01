const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentPriority extends Model {};

ExperimentPriority.init(
    {
        experiment_priority_id: {
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
        priority_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'priority',
                key: 'priority_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_priority',
        timestamps: false
    }
)

module.exports = ExperimentPriority;