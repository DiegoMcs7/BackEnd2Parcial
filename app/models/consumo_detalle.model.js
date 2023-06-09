module.exports = (sequelize, Sequelize) => {
    const Detalle = sequelize.define('Detalle', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_cabecera: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Cabeceras',
                key: 'id'
            }
        },
        id_producto: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Productos',
                key: 'id'
            }
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
      });
    
    return Detalle;
    
};