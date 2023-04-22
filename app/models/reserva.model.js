module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define('Reserva', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_restaurante: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Restaurantes',
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
        fecha: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        hora: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_cliente: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Clientes',
                key: 'id'
            }
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        
      });
    
    return Reserva;
    
};