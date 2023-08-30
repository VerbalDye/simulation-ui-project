const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ModelObject extends Model {};

ModelObject.init(
    {
        model_number: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        modelName: 'model',
        timestamps: false
    }
)

module.exports = ModelObject;