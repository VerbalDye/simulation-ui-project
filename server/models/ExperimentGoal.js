const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentGoal extends Model {};

ExperimentGoal.init(
    {
        experiment_goal_id: {
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
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        target_id: {
            type: DataTypes.INTEGER
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.FLOAT,
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        last_modified: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_goal',
        timestamps: false
    }
)

module.exports = ExperimentGoal;