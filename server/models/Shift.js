const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Shift extends Model {};

Shift.init(
    {
        shift_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        crew: {
            type: DataTypes.STRING,
            allowNull: false
        },
        begin: {
            type: DataTypes.TIME,
            allowNull: true
        },
        end: {
            type: DataTypes.TIME,
            allowNull: true
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
        modelName: 'shift',
        timestamps: false
    }
)

module.exports = Shift;