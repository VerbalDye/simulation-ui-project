const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentTimeDistribution extends Model {};

ExperimentTimeDistribution.init(
    {
        experiment_time_distribution_id: {
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
        process_time_distribution_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'process_time_distribution',
                key: 'process_time_distribution_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_time_distribution',
        timestamps: false
    }
)

module.exports = ExperimentTimeDistribution;