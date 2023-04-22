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


module.exports = db;