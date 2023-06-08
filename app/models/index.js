const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    port: dbConfig.PORT,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
    });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Restaurante = require("./restaurante.model.js")(sequelize, Sequelize);
db.Mesa = require("./mesa.model.js")(sequelize, Sequelize);
db.Cliente = require("./cliente.model.js")(sequelize, Sequelize);
db.Reserva = require("./reserva.model.js")(sequelize, Sequelize);
db.Categoria = require("./categoria.model.js")(sequelize, Sequelize);
db.Producto = require("./producto.model.js")(sequelize, Sequelize);
db.Cabecera = require("./consumo_cabecera.model.js")(sequelize, Sequelize);
db.Detalle = require("./consumo_detalle.model.js")(sequelize, Sequelize);

// Asociación entre Restaurante y Mesa
db.Restaurante.hasMany(db.Mesa, { foreignKey: 'id_restaurante' });
db.Mesa.belongsTo(db.Restaurante, { foreignKey: 'id_restaurante' });

// Asociación entre Cliente y Reserva
db.Cliente.hasMany(db.Reserva, { foreignKey: 'id_cliente' });
db.Reserva.belongsTo(db.Cliente, { foreignKey: 'id_cliente' });

// Asociación entre Restaurante y Reserva
db.Restaurante.hasMany(db.Reserva, { foreignKey: 'id_restaurante' });
db.Reserva.belongsTo(db.Restaurante, { foreignKey: 'id_restaurante' });

// Asociación entre Mesa y Reserva
db.Mesa.hasMany(db.Reserva, { foreignKey: 'id_mesa' });
db.Reserva.belongsTo(db.Mesa, { foreignKey: 'id_mesa' });

// Asociación entre Categoria y Producto
db.Categoria.hasMany(db.Producto, { foreignKey: 'id_categoria' });
db.Producto.belongsTo(db.Categoria, { foreignKey: 'id_categoria' });

// Asociación entre Mesa y Cabecera
db.Mesa.hasMany(db.Cabecera, { foreignKey: 'id_mesa' });
db.Cabecera.belongsTo(db.Mesa, { foreignKey: 'id_mesa' });

// Asociación entre Cliente y Cabecera
db.Cliente.hasMany(db.Cabecera, { foreignKey: 'id_cliente' });
db.Cabecera.belongsTo(db.Cliente, { foreignKey: 'id_cliente' });

// Asociación entre Cabecera y Detalle
db.Cabecera.hasMany(db.Detalle, { foreignKey: 'id_cabecera' });
db.Detalle.belongsTo(db.Cabecera, { foreignKey: 'id_cabecera' });

// Asociación entre Producto y Detalle
db.Producto.hasMany(db.Detalle, { foreignKey: 'id_producto' });
db.Detalle.belongsTo(db.Producto, { foreignKey: 'id_producto' });

module.exports = db;