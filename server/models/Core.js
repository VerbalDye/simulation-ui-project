const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Core extends Model {};

Core.init(
    {
        core_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        core_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        model_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'model',
                key: 'model_number'
            }
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