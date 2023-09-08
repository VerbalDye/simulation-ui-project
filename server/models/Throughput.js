const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Throughput extends Model {};

Throughput.init(
    {
        throughput_id: {
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
        },
        replication: {
            type: DataTypes.INTEGER
        },
        job_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        job_start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        job_finish: {
            type: DataTypes.DATE,
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'throughput',
        timestamps: false
    }
)

module.exports = Throughput;