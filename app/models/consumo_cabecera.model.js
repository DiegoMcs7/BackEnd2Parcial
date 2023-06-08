module.exports = (sequelize, Sequelize) => {
    const Cabecera = sequelize.define('Cabecera', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_cliente: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Clientes',
                key: 'id'
            }
        },
        id_mesa: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Mesas',
                key: 'id'
            }
        },
        total: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        estado: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fecha_cierre: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        
      });
    
    return Cabecera;
    
};