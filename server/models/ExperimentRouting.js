const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentRouting extends Model {};

ExperimentRouting.init(
    {
        experiment_routing_id: {
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
        routing_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'routing',
                key: 'routing_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_routing',
        timestamps: false
    }
)

module.exports = ExperimentRouting;