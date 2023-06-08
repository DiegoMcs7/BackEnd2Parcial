const db = require("../models");
const Cliente = db.Cliente;
const Cabecera = db.Cabecera;
const Restaurante = db.Restaurante;
const Mesa = db.Mesa;
const Op = db.Sequelize.Op;
const estados = [
    { id: 1, rango: 'abierto' },
    { id: 2, rango: 'cerrado' },
];

exports.create = (req, res) => {
    const cabecera = {
        id_mesa: req.body.id_mesa,
        fecha_cierre: req.body.fecha_cierre,
        id_cliente: req.body.id_cliente,
        cantidad: req.body.cantidad,
        total: req.body.total,
    };

    function buscarEstadoPorIds(ids) {
        if (ids === undefined) {
            return [];
        }
        return ids.map(id => estados.find(estado => estado.id === id)?.rango);
    }
      
    const estado = buscarEstadoPorIds(req.body.estado);
    cabecera.estado = estado.join(', '); // unimos los estados seleccionadas en una cadena de texto separada por comas


    Cabecera.create(cabecera)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear la cabecera."
            });
        });
};


exports.findAll = (req, res) => {
    Cabecera.findAll({
      include: [
    { model: db.Mesa },
    { model: db.Cliente }
  ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrió un error al obtener las cabeceras.",
        });
      });
  };