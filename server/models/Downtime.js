const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Downtime extends Model {};

Downtime.init(
    {
        asset_downtime_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        asset_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset',
                key: 'asset_id'
            }
        },
        day_num: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'asset_downtime',
        timestamps: false
    }
)

module.exports = Downtime;