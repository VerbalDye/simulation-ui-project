const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentJobMix extends Model {};

ExperimentJobMix.init(
    {
        experiment_job_mix_id: {
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
        job_mix_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'job_mix',
                key: 'job_mix_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_job_mix',
        timestamps: false
    }
)

module.exports = ExperimentJobMix;