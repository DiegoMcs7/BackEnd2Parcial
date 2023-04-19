const { Restaurante } = require("./restaurante.model.js");

module.exports = (sequelize, Sequelize) => {
    const Mesa = sequelize.define('Mesa', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_mesa: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        id_restaurante: {
            type: Sequelize.INTEGER,
            references: {
                // This is a reference to another model
                model: Restaurante,
                // This is the column name of the referenced model
                key: 'id'
            },
        },
        posicion_x: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        posicion_y: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        planta: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        capacidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
      });
    
    return Mesa;
    
};