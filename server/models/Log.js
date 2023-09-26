const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Log extends Model {};

Log.init(
    {
        log_id: {
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
        info: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'log',
        timestamps: false
    }
)

module.exports = Log;