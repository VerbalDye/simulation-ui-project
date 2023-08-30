const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class TaskSequence extends Model {};

TaskSequence.init(
    {
        task_sequence_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phase_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'phases',
                key: 'phase_id'
            }
        },
        cell_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cell',
                key: 'cell_id'
            }
        },
        operation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operation',
                key: 'operation_id'
            }
        },
        next_operation: {
            type: DataTypes.INTEGER
        },
        start: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
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
        modelName: 'task_sequence',
        timestamps: false
    }
)

module.exports = TaskSequence;