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
    let hora_aux = req.query.hora;
    if (!Array.isArray(hora_aux)) {
      hora_aux = [hora_aux];
    }
    const horas = [
      { id: 1, rango: '12 a 13' },
      { id: 2, rango: '13 a 14' },
      { id: 3, rango: '14 a 15' },
      { id: 4, rango: '19 a 20' },
      { id: 5, rango: '20 a 21' },
      { id: 6, rango: '21 a 22' },
      { id: 7, rango: '22 a 23' }
    ];
  
    function buscarHoraPorIds(ids) {
      if (ids === undefined) {
          return [];
      }
      const idArray = ids.join(',').split(','); // Convert array to string and split
      return idArray.map(id => horas.find(hora => hora.id === parseInt(id))?.rango);
    }    
  
    const horaa = buscarHoraPorIds(hora_aux); // horaa es un string con dos valores separados por coma, por ejemplo: "12 a 13, 13 a 14"
    const horaaArray = horaa.map(h => h.trim()); // convierte a arreglo y quita espacios en blanco, por ejemplo: ["12 a 13", "13 a 14"]
    const whereClause = horaaArray.map(h => ({ hora: { [Op.iLike]: `%${h}%` } })); // convierte cada elemento en un objeto de búsqueda
    const reservas = await db.Reserva.findAll({
      where: {
        id_restaurante: req.query.restaurante,
        fecha: req.query.fecha,
        [Op.or]: whereClause // busca cualquier registro que contenga cualquiera de los valores especificados en el arreglo
      }
    });

    const mesasReservadasIds = reservas.map((reserva) => reserva.id_mesa);
    console.log(mesasReservadasIds);

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

  getMesasDisponibles().then(mesasDisponibles => {
    let hora = req.query.hora;
    if (!Array.isArray(hora)) {
      hora = [hora];
    }
    res.render("mesa_list_reservas", {
      mesas: mesasDisponibles,
      restaurante: req.query.restaurante,
      fecha: req.query.fecha,
      hora: hora,
    });
  }).catch(error => {
    console.error(error);
    res.status(500).send('Internal server error');
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
  let hora_aux = req.body.hora;
  console.log(hora_aux);

  if (!Array.isArray(hora_aux)) {
    hora_aux = [hora_aux];
  }
  const reserva = {
    id_restaurante: req.body.restaurante,
    id_cliente: req.body.cliente,
    id_mesa: req.body.mesas,
    fecha: req.body.fecha,
    hora: hora_aux,
    cantidad: '1',
    
  };
  console.log(reserva);

  const horas = [
    { id: '1', rango: '12 a 13' },
    { id: '2', rango: '13 a 14' },
    { id: '3', rango: '14 a 15' },
    { id: '4', rango: '19 a 20' },
    { id: '5', rango: '20 a 21' },
    { id: '6', rango: '21 a 22' },
    { id: '7', rango: '22 a 23' }
];

  function buscarHoraPorIds(ids) {
    if (ids === undefined) {
        return [];
    }
    const idArray = ids[0].split(','); // Separa el string de ids en un arreglo
    return idArray.map(id => horas.find(hora => hora.id === id)?.rango);
  }

  const hora = buscarHoraPorIds(hora_aux);
  reserva.hora = hora.join(', '); // unimos las horas seleccionadas en una cadena de texto separada por comas


    // Guardamos en la base de datos
    console.log(reserva);

    db.Reserva.create(reserva)
    .then(() => {
      console.log("entra log");
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
    })
    .catch((err) => {
      console.log("no entra log");
      res.status(400).json({ message: err.message });
    });
})

app.get('/gestion-consumo/:mesaid', (req, res) => {
    async function getCabecera() {
      const mesaID = req.params.mesaid;
      console.log(mesaID);
      const listado_consumo = await db.Cabecera.findAll({
        where: {
          id_mesa: req.params.mesaid,
       }
      });
      const usersDataValues = listado_consumo.map(listado_consumo => listado_consumo.dataValues);
      return usersDataValues;
    }
    getCabecera().then(listado_consumo => {
      const contador_cerrado =0;
     // si el valor de  contador_cerrado es 1 entonces hay consumos no cerrados, por lo tanto no se puede crear un nuevo consumo
      for (let i = 0; i < listado_consumo.length; i++) {
        if (listado_consumo[i].estado === 'cerrado') {
            contador_cerrado = 1;
        }
      }
      console.log(req.params.mesaid);
      res.render("gestion-consumo-mesas", { mesa: req.params.mesaid, listado_consumo: listado_consumo, contador_cerrado: contador_cerrado });
    });
});

app.post("/crear_cabecera_consumo", (req, res) => {

  async function getProducto() {
    const productos = await db.Producto.findAll();
    const usersDataValues = productos.map(productos => productos.dataValues);
    return usersDataValues;
  }

  // Utilizando .then()
  getProducto().then(productos => {

    const cabecera = {
      id_mesa: req.body.mesa,
      id_cliente: req.body.cliente,
      total: 0,
      estado: "abierto",
    };

    cabecera = db.Cabecera.create(cabecera)
    .then(() => {
      console.log("HOLALALALAALALAL");
      
      console.log(cabecera);
      // res.render("gestion-detalle-mesas", { cabecera: cabecera.id, productos: productos });

    })
    .catch((err) => {
      console.log("no entra log");
      res.status(400).json({ message: err.message });
    });
      
  });

 

    
})

app.post("/crear_detalle_consumo", (req, res) => {

  async function getProducto() {
    const productos = await db.Producto.findAll();
    const usersDataValues = productos.map(productos => productos.dataValues);
    return usersDataValues;
  }

  // Utilizando .then()
  getProducto().then(productos => {

    const detalle = {
      id_producto: req.body.producto,
      id_cabecera: req.body.cabecera,
      cantidad: req.body.cantidad,
    };
  
      db.Cabecera.create(cabecera)
      .then(() => {
        res.render("gestion-detalle-mesas", { productos:productos, });
  
      })
      .catch((err) => {
        console.log("no entra log");
        res.status(400).json({ message: err.message });
      });
      
  });

  
})


require("./app/routes/restaurante.routes")(app);
require("./app/routes/mesa.routes")(app);
require("./app/routes/cliente.routes")(app);
require("./app/routes/reserva.routes")(app);
require("./app/routes/categoria.routes")(app);
require("./app/routes/producto.routes")(app);
require("./app/routes/consumo_cabecera.routes")(app);
require("./app/routes/consumo_detalle.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto 9090.');
});