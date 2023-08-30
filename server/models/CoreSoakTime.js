const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CoreSoakTime extends Model {};

CoreSoakTime.init(
    {
        core_soak_time_id: {
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
        model_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'model',
                key: 'model_number'
            }
        },
        soak_temperature_f: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        time_minutes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        core_oven_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        core_oven_drawer_position: {
            type: DataTypes.STRING,
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
        modelName: 'core_soak_time',
        timestamps: false
    }
)

module.exports = CoreSoakTime;