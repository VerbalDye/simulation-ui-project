const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentWorkerShift extends Model {};

ExperimentWorkerShift.init(
    {
        experiment_worker_shift_id: {
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
        worker_shift_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'worker_shift',
                key: 'worker_shift_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_worker_shift',
        timestamps: false
    }
)

module.exports = ExperimentWorkerShift;