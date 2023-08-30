const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Scenario extends Model {};

Scenario.init(
    {
        scenario_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        scenario_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experiment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'experiment',
                key: 'experiment_id'
            }
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
        modelName: 'scenario',
        timestamps: false
    }
)

module.exports = Scenario;