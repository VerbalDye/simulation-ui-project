const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Core extends Model {};

Core.init(
    {
        core_number: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
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
        modelName: 'core',
        timestamps: false
    }
)

module.exports = Core;