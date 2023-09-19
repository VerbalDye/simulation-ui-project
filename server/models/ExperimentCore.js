const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentCore extends Model {};

ExperimentCore.init(
    {
        experiment_core_id: {
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
        core_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'core',
                key: 'core_number'
            }
        },
        available: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_core',
        timestamps: false
    }
)

module.exports = ExperimentCore;