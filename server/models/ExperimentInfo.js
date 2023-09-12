const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentInfo extends Model {};

ExperimentInfo.init(
    {
        experiment_info_id: {
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
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_info',
        timestamps: false
    }
)

module.exports = ExperimentInfo;