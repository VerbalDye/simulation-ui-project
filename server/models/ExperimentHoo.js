const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentHoo extends Model {};

ExperimentHoo.init(
    {
        experiment_hoo_id: {
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
        hours_of_operation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'hours_of_operation',
                key: 'hours_of_operation_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_hoo',
        timestamps: false
    }
)

module.exports = ExperimentHoo;