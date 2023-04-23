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
app.get("/cliente_list", (req, res) => {
    async function getCliente() {
        const clientes = await db.Cliente.findAll();
        const usersDataValues = clientes.map(clientes => clientes.dataValues);
        return usersDataValues;
    }
      
    // Utilizando .then()
    getCliente().then(clientes => {
    res.render("cliente_list", {clientes: clientes});

  });
});

app.get("/restaurante_list", (req, res) => {
    async function getRestaurante() {
        const restaurantes = await db.Restaurante.findAll();
        const usersDataValues = restaurantes.map(restaurantes => restaurantes.dataValues);
        return usersDataValues;
    }
      
    // Utilizando .then()
    getRestaurante().then(restaurantes => {
    res.render("restaurante_list", {restaurantes: restaurantes});

  });
});

app.get("/mesa_list", (req, res) => {
    async function getMesas() {
        const mesas = await db.Mesa.findAll({
            include: [{
              model: db.Restaurante,
              attributes: ['nombre']
            }]
          });
        const usersDataValues = mesas.map(mesas => mesas.dataValues);
        return usersDataValues;
    }
      
    // Utilizando .then()
    getMesas().then(mesas => {
    res.render("mesa_list", {mesas: mesas});

  });
});

app.get("/reservas_list", (req, res) => {
    async function getReservas() {
      const reservas = await db.Reserva.findAll({
          include: [
            { model: db.Restaurante, 
              attributes: ['nombre']
            },
            { model: db.Mesa,
              attributes: ['nombre_mesa']

            },
            { model: db.Cliente,
              attributes: ['nombre', 'apellido']
            }
          ]
        });
        const usersDataValues = reservas.map(reservas => reservas.dataValues);
        return usersDataValues;
    }
    getReservas().then(reservas => {
      console.log(reservas);
      res.render("reservas_list", {reservas: reservas});
    });
  });
    
  app.get("/reservas_create", (req, res) => {
        async function getDatosReservas() {
          const restaurantes = await db.Restaurante.findAll();
          const mesas = await db.Mesa.findAll();
          const clientes = await db.Cliente.findAll();
          const usersDataValues = restaurantes.map(restaurantes => restaurantes.dataValues);
          const usersDataValues1 = clientes.map(clientes => clientes.dataValues);
          const usersDataValues2 = mesas.map(mesas => mesas.dataValues);
          return { restaurantes: usersDataValues, clientes: usersDataValues1,mesas: usersDataValues2 };
      }
        
        // Utilizando .then()
        getDatosReservas().then((data) => {
          console.log(data.mesas);
          res.render("reservas_create", { restaurantes: data.restaurantes, mesas: data.mesas, clientes: data.clientes });
        });
       
       
  });


  app.post("/reservas_create_post", (req, res) => {
    async function postReservas() {
        const reservas = await db.Reserva.findAll({
            include: [
              { model: db.Restaurante, 
                attributes: ['nombre']
              },
              { model: db.Mesa,
                attributes: ['nombre_mesa']
  
              },
              { model: db.Cliente,
                attributes: ['nombre', 'apellido']
              }
            ]
          });
        const usersDataValues = reservas.map(reservas => reservas.dataValues);
        console.log(usersDataValues);
        return usersDataValues;
    }
  // Utilizando .then()
  postReservas().then(reservas => {
  res.render("reservas_create_post", {reservas: reservas});

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