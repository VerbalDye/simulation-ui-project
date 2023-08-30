const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentTaskSequence extends Model {};

ExperimentTaskSequence.init(
    {
        experiment_task_sequence_id: {
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
        task_sequence_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'task_sequence',
                key: 'task_sequence_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_task_sequence',
        timestamps: false
    }
)

module.exports = ExperimentTaskSequence;