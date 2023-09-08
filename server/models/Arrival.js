const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Arrival extends Model {};

Arrival.init(
    {
        arrival_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        experiment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'experiment',
                key: 'experiment_id'
            }
        },
        replication: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        arrival_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        promise_date: {
            type: DataTypes.DATE
        },
        arrival_time: {
            type: DataTypes.TIME,
            allowNull: false
        },      
        job_mix_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'job_mix',
                key: 'job_mix_id'
            }
        },  
        job_number: {
            type: DataTypes.INTEGER,
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
        modelName: 'arrival',
        timestamps: false
    }
)

module.exports = Arrival;