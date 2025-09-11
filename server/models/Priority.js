const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Priority extends Model {};

Priority.init(
    {
        priority_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        operation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operation',
                key: 'operation_id'
            }
        },
        static_priority: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        max_tubes: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        max_priority: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        n_growth: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        time_growth: {
            type: DataTypes.FLOAT,
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
        modelName: 'priority',
        timestamps: false
    }
)

module.exports = Priority;