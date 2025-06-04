const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentTimeType extends Model {};

ExperimentTimeType.init(
    {
        experiment_time_type_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        experiment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'experiment',
                key: 'experiment_id'
            }
        },
        iteration_number: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        discrete: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_time_type',
        timestamps: false
    }
)

module.exports = ExperimentTimeType;