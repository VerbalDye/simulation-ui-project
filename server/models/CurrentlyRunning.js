const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CurrentlyRunning extends Model {};

CurrentlyRunning.init(
    {
        currently_running_id: {
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
        started: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'currently_running',
        timestamps: false
    }
)

module.exports = CurrentlyRunning;