const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ProcessTimeDistribution extends Model {};

ProcessTimeDistribution.init(
    {
        process_time_distribution_id: {
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
        operation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operation',
                key: 'operation_id'
            }
        },
        model_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'model',
                key:'model_number'
            }
        },
        distribution: {
            type: DataTypes.ENUM(['Lognormal', 'Normal', 'Beta', 'Triangular', 'Uniform', 'Exponential']),
            allowNull: false
        },
        param1: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        param2: {
            type: DataTypes.DOUBLE
        },
        param3: {
            type: DataTypes.DOUBLE
        },
        min: {
            type: DataTypes.DOUBLE
        },
        max: {
            type: DataTypes.DOUBLE
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
        modelName: 'process_time',
        timestamps: false
    }
)

module.exports = ProcessTimeDistribution;