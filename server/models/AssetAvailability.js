const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class AssetAvailability extends Model {};

AssetAvailability.init(
    {
        asset_availability_id: {
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
        },
        replication: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        asset_id: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            references: {
                model: 'asset',
                key: 'asset_id'
            }
        },
        available_time: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        weekday: {
            type: DataTypes.INTEGER
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'asset_availability',
        timestamps: false
    }
)

module.exports = AssetAvailability;