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
        asset_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset',
                key: 'asset_id'
            }
        },
        utilization: {
            type: DataTypes.DOUBLE(5,5),
        },
        greater_than: {
            type: DataTypes.BOOLEAN,
        },
        created: {
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