const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Directory extends Model { }

Directory.init(
    {
        photo_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, 
    {
    
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'directory'
}
)


module.exports = Directory;