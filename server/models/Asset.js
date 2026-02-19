const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Asset extends Model {};

Asset.init(
    {
        asset_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        asset_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        asset_type: {
            type: DataTypes.STRING
        },
        pos_x: {
            type: DataTypes.INTEGER
        },      
        pos_y: {
            type: DataTypes.INTEGER
        },  
        pos_z: {
            type: DataTypes.INTEGER
        },  
        dim_length_feet: {
            type: DataTypes.INTEGER
        },  
        dim_width_feet: {
            type: DataTypes.INTEGER
        },  
        dim_height_feet: {
            type: DataTypes.INTEGER
        },
        capacity: {
            type: DataTypes.INTEGER
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        run_unattended: {
            type: DataTypes.BOOLEAN,
            defaultValue: '0'
        }
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
        modelName: 'asset',
        timestamps: false
    }
)

// Asset.removeAttribute('id');

module.exports = Asset;