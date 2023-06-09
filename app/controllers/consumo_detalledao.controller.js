const db = require("../models");
const Producto = db.Producto;
const Detalle = db.Detalle;
const Cabecera = db.Cabecera;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const detalle = {
        id_cabecera: req.body.id_cabecera,
        id_producto: req.body.id_producto,
        cantidad: req.body.cantidad
    };

    Detalle.create(detalle)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el detalle."
            });
        });
};


exports.findAll = (req, res) => {
    Detalle.findAll({
      include: [
    { model: db.Cabecera },
    { model: db.Producto }
  ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrió un error al obtener los detalles.",
        });
      });
  };