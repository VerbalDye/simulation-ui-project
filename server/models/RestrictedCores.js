const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class RestrictedCores extends Model {};

RestrictedCores.init(
    {
        core_location_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        core_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'core',
                key: 'core_number'
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
        modelName: 'restricted_cores',
        timestamps: false
    }
)

module.exports = RestrictedCores;