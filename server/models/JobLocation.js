const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class JobLocation extends Model {};

JobLocation.init(
    {
        job_location_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        job_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: 'experiment',
            //     key: 'experiment_id'
            // }
        },
        operation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operation',
                key: 'operation_id'
            }
        },
        asset_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset',
                key: 'asset_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'job_location',
        timestamps: false
    }
)

module.exports = JobLocation;