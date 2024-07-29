const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Experiment extends Model {};

Experiment.init(
    {
        experiment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        experiment_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        scenario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'scenario',
                key: 'scenario_id'
            }
        },
        last_run_id: {
            type: DataTypes.INTEGER,
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
        modelName: 'experiment',
        timestamps: false
    }
)

module.exports = Experiment;