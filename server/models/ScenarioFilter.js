const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ScenarioFilter extends Model {};

ScenarioFilter.init(
    {
        scenario_filter_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        scenario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'scenario',
                key: 'scenario_id'
            }
        },
        analysis_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experiment_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false
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
        modelName: 'scenario_filter',
        timestamps: false
    }
)

module.exports = ScenarioFilter;