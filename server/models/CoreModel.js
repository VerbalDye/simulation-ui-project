const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CoreModel extends Model {};

CoreModel.init(
    {
        core_model_id: {
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
        status: {
            type: DataTypes.STRING,
            allowNull: false
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
        modelName: 'core_model',
        timestamps: false
    }
)

module.exports = CoreModel;