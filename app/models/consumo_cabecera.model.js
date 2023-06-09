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
        
        fecha_creacion: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW // Establece la fecha y hora actual automáticamente
        },

        fecha_cierre: {
            type: Sequelize.DATE,
            allowNull: true
        },
        
      });
    
    return Cabecera;
    
};