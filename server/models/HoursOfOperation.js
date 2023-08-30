const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class HoursOfOperation extends Model {};

HoursOfOperation.init(
    {
        hours_of_operation_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        site_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'site',
                key: 'site_id'
            }
        },
        day_num: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_time: {
            type: DataTypes.TIME
        },
        end_time: {
            type: DataTypes.TIME
        },
        total_hours: {
            type: DataTypes.INTEGER,
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
        modelName: 'hours_of_operation',
        timestamps: false
    }
)

module.exports = HoursOfOperation;