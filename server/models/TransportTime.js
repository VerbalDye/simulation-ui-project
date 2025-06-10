const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class TransportTime extends Model {};

TransportTime.init(
    {
        transport_time_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        origin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset',
                key: 'asset_id'
            }
        },
        destination: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset',
                key: 'asset_id'
            }
        },
        transport_time: {
            type: DataTypes.FLOAT,
            allowNull: false
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
        modelName: 'transport_time',
        timestamps: false
    }
)

module.exports = TransportTime;