const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const path = require('path');
const { Console } = require("console");
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
app.set('views', path.join(__dirname + '/app/views'));
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
    res.render("cliente_list", { clientes: clientes });

  });
});

app.get('/clientes/buscar', async (req, res) => {
  const busqueda = req.query.nombre;
  const clientes = await db.Cliente.findAll({
    where: {
      nombre: {
        [Op.iLike]: `%${busqueda}%` // Busca coincidencias parciales en el nombre del cliente
      }
    }
  });
  res.json(clientes);
});

app.post("/clientes_create", (req, res) => {
  console.log("CICOS");
  const cliente = {
    ci: req.body.ci,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
};
    // Guardamos en la base de datos
    console.log(cliente);

    db.Cliente.create(cliente)
    .then(() => {
      console.log("entra log");
      res.json({ status: 'success' });
    })
    .catch((err) => {
      console.log("no entra log");
      res.status(400).json({ message: err.message });
    });
})




app.get("/restaurante_list", (req, res) => {
  async function getRestaurante() {
    const restaurantes = await db.Restaurante.findAll();
    const usersDataValues = restaurantes.map(restaurantes => restaurantes.dataValues);
    return usersDataValues;
  }

  // Utilizando .then()
  getRestaurante().then(restaurantes => {
    res.render("restaurante_list", { restaurantes: restaurantes });
  });
});




app.get("/get_mesas_disponibles", (req, res) => {
  const Op = db.Sequelize.Op;
  async function getMesasDisponibles() {
    // Primero, buscamos todas las reservas existentes para la fecha y horas seleccionadas en el restaurante deseado
    const reservas = await db.Reserva.findAll({
      where: {
        id_restaurante: req.query.restaurante,
        fecha: req.query.fecha,
        hora: { [Op.in]: req.query.hora.split(',') },
      },
    });

    // Obtenemos los IDs de las mesas reservadas
    const mesasReservadasIds = reservas.map((reserva) => reserva.id_mesa);

    // Buscamos todas las mesas del restaurante que no están en la lista de mesas reservadas
    const mesasDisponibles = await db.Mesa.findAll({
      include: [{
        model: db.Restaurante,
        attributes: ['nombre']
      }],
      where: {
        id_restaurante: req.query.restaurante,
        id: { [Op.notIn]: mesasReservadasIds },
      },
    });

    const restaurantes = await db.Restaurante.findAll();
    const usersDataValues = mesasDisponibles.map(mesasDisponibles => mesasDisponibles.dataValues);
    return usersDataValues;
  }

  // Utilizando .then()
  getMesasDisponibles().then(mesasDisponibles => {
    console.log(req.query.hora );
    res.render("mesa_list_reservas", { mesas: mesasDisponibles, restaurante: req.query.restaurante, 
      fecha: req.query.fecha, hora: { [Op.in]: req.query.hora.split(',') },
  });
  });
});

app.get("/cliente_list_json", (req, res) => {
  async function getClientes() {
    const clientes = await db.Cliente.findAll();
    const usersDataValues = clientes.map(clientes => clientes.dataValues);
    return usersDataValues;
  }

  // Utilizando .then()
  getClientes().then(clientes => {
    res.send(clientes);
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
    res.render("mesa_list", { mesas: mesas });

  });
});

app.get("/reservas_list", (req, res) => {
  async function getReservas() {
    const reservas = await db.Reserva.findAll({
      include: [
        {
          model: db.Restaurante,
          attributes: ['nombre']
        },
        {
          model: db.Mesa,
          attributes: ['nombre_mesa']

        },
        {
          model: db.Cliente,
          attributes: ['nombre', 'apellido']
        }
      ]
    });
    const usersDataValues = reservas.map(reservas => reservas.dataValues);
    return usersDataValues;
  }
  getReservas().then(reservas => {
    res.render("reservas_list", { reservas: reservas });
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
    return { restaurantes: usersDataValues, clientes: usersDataValues1, mesas: usersDataValues2 };
  }

  // Utilizando .then()
  getDatosReservas().then((data) => {
    res.render("reservas_create", { restaurantes: data.restaurantes, mesas: data.mesas, clientes: data.clientes, result: "" });
  });
});
app.post("/reservas_create_post", (req, res) => {
  console.log("RESERVA AA");
  const reserva = {
    restaurante: req.body.restaurante,
    mesa: req.body.mesas,
    fecha: req.body.fecha,
    hora: req.body.hora,
    
};
    // Guardamos en la base de datos
    console.log(reserva);

    // db.Cliente.create(cliente)
    // .then(() => {
    //   console.log("entra log");
    //   res.json({ status: 'success' });
    // })
    // .catch((err) => {
    //   console.log("no entra log");
    //   res.status(400).json({ message: err.message });
    // });
})

require("./app/routes/restaurante.routes")(app);
require("./app/routes/mesa.routes")(app);
require("./app/routes/cliente.routes")(app);
require("./app/routes/reserva.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto 9090.');
});