const models = require("../models");

module.exports = (sequelize, Sequelize) => {
    const Restaurante = sequelize.define('Restaurante', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        direccion: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      });


     return Restaurante;
    
};