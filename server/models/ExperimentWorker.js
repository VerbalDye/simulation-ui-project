const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentWorker extends Model {};

ExperimentWorker.init(
    {
        experiment_worker_id: {
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
        worker_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'worker',
                key: 'worker_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_worker',
        timestamps: false
    }
)

module.exports = ExperimentWorker;