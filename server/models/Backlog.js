const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Backlog extends Model {};

Backlog.init(
    {
        backlog_id: {
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
        job_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        serial_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        part_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'model',
                key: 'model_number'
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_labor: {
            type: DataTypes.DATE
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        adhesive_dry: {
            type: DataTypes.DATE
        },
        scheduled: {
            type: DataTypes.BOOLEAN
        },
        promise_date: {
            type: DataTypes.DATEONLY
        },
        day_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        week_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expedite: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        job_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        order_number: {
            type: DataTypes.INTEGER
        },
        customer_name: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'backlog',
        timestamps: false
    }
)

module.exports = Backlog;