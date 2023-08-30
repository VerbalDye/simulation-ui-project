const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentAsset extends Model {};

ExperimentAsset.init(
    {
        experiment_asset_id: {
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
        asset_id: {
            type: DataTypes.STRING,
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
        modelName: 'experiment_asset',
        timestamps: false
    }
)

module.exports = ExperimentAsset;