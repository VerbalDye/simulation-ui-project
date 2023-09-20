const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class JobCore extends Model {};

JobCore.init(
    {
        job_core_id: {
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
        job_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: 'experiment',
            //     key: 'experiment_id'
            // }
        },
        core_number: {
            type: DataTypes.INTEGER,
            references: {
                model: 'core',
                key: 'core_number'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'job_core',
        timestamps: false
    }
)

module.exports = JobCore;