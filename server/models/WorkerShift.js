const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class WorkerShift extends Model {};

WorkerShift.init(
    {
        worker_shift_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        worker_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'worker',
                key: 'worker_id'
            }
        },
        shift_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shift',
                key: 'shift_id'
            }
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
        modelName: 'worker_shift',
        timestamps: false
    }
)

module.exports = WorkerShift;