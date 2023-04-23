const db = require("../models");
const Cliente = db.Cliente;
const Reserva = db.Reserva;
const Restaurante = db.Restaurante;
const Mesa = db.Mesa;
const Op = db.Sequelize.Op;
const horas = [
    { id: 1, rango: '12 a 13' },
    { id: 2, rango: '13 a 14' },
    { id: 3, rango: '14 a 15' },
    { id: 4, rango: '19 a 20' },
    { id: 5, rango: '20 a 21' },
    { id: 6, rango: '21 a 22' },
    { id: 7, rango: '22 a 23' }
];

exports.create = (req, res) => {
    const reserva = {
        id_restaurante: req.body.id_restaurante,
        id_mesa: req.body.id_mesa,
        fecha: req.body.fecha,
        id_cliente: req.body.id_cliente,
        cantidad: req.body.cantidad,
    };
    
    function buscarHoraPorIds(ids) {
        if (ids === undefined) {
            return [];
        }
        return ids.map(id => horas.find(hora => hora.id === id)?.rango);
    }
      
    const hora = buscarHoraPorIds(req.body.hora);
    reserva.hora = hora.join(', '); // unimos las horas seleccionadas en una cadena de texto separada por comas

    Reserva.create(reserva)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear la reserva."
            });
        });
};


exports.findAll = (req, res) => {
    Reserva.findAll({
      include: [
    { model: db.Restaurante },
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
            err.message || "Ocurrió un error al obtener las reservas.",
        });
      });
  };