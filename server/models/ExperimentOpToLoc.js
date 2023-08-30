const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentOpToLoc extends Model {};

ExperimentOpToLoc.init(
    {
        experiment_op_to_loc_id: {
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
        operation_to_location_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'operation_to_location',
                key: 'operation_to_location_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_op_to_loc',
        timestamps: false
    }
)

module.exports = ExperimentOpToLoc;