const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentDowntime extends Model {};

ExperimentDowntime.init(
    {
        experiment_asset_downtime: {
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
        asset_downtime_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'downtime',
                key: 'asset_downtime_id'
            }
        },
        iteration_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_asset_downtime',
        timestamps: false
    }
)

module.exports = ExperimentDowntime;