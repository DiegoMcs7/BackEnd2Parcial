const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const path = require('path');
db.sequelize.sync();

var corsOptions = {
    origin: "http://localhost:9091"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // Establece EJS como motor de plantillas
app.set('views',path.join(__dirname + '/app/views'));
app.use(express.static(__dirname + '/app/public'));  //en public los archivos css y js

// simple route
app.get("/clientes", (req, res) => {
    async function getCliente() {
        const clientes = await db.Cliente.findAll();
        const usersDataValues = clientes.map(clientes => clientes.dataValues);
        return usersDataValues;
    }
      
    // Utilizando .then()
    getCliente().then(clientes => {
    res.render("cliente", {clientes: clientes});

  });
});

app.get("/restaurantes", (req, res) => {
    async function getRestaurante() {
        const restaurantes = await db.Restaurante.findAll();
        const usersDataValues = restaurantes.map(restaurantes => restaurantes.dataValues);
        return usersDataValues;
    }
      
    // Utilizando .then()
    getRestaurante().then(restaurantes => {
    res.render("restaurante", {restaurantes: restaurantes});

  });
});

app.get("/mesas", (req, res) => {
    async function getMesas() {
        const mesas = await db.Mesa.findAll({
            include: [{
              model: db.Restaurante,
            }]
          });
        const usersDataValues = mesas.map(mesas => mesas.dataValues);
        console.log(usersDataValues);
        return usersDataValues;
    }
      
    // Utilizando .then()
    getMesas().then(mesas => {
    res.render("mesa", {mesas: mesas});

  });
});

require("./app/routes/restaurante.routes")(app);
require("./app/routes/mesa.routes")(app);
require("./app/routes/cliente.routes")(app);
require("./app/routes/reserva.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
console.log('Servidor corriendo en puerto 9090.');
});