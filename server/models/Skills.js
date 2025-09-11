const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Skills extends Model {};

Skills.init(
    {
        skills_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        worker_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'worker',
                key: 'worker_id'
            }
        },
        operation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operation',
                key: 'operation_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'skills',
        timestamps: false
    }
)

module.exports = Skills;