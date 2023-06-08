module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define('Producto', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_producto: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        id_categoria: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Categoria',
                key: 'id'
            }
        },
        precio: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
      });
    

    return Producto;
    
};