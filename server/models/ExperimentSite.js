const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ExperimentSite extends Model {};

ExperimentSite.init(
    {
        experiment_site_id: {
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
        site_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'site',
                key: 'site_id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'experiment_site',
        timestamps: false
    }
)

module.exports = ExperimentSite;