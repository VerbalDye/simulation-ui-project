const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentSkills extends Model {};

ExperimentSkills.init(
    {
        experiment_skills_id: {
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
        skills_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'skills',
                key: 'skills_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_skills',
        timestamps: false
    }
)

module.exports = ExperimentSkills;