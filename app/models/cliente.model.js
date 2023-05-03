module.exports = (sequelize, Sequelize) => {
    const Cliente = sequelize.define('Cliente', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ci: {
            type: Sequelize.INTEGER,
            unique: true
        },
        nombre: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        apellido: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      });
    
    return Cliente;
    
};