const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentShift extends Model {};

ExperimentShift.init(
    {
        experiment_shift_id: {
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
            allowNull: false
        },
        shift_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shift',
                key: 'shift_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_shift',
        timestamps: false
    }
)

module.exports = ExperimentShift;