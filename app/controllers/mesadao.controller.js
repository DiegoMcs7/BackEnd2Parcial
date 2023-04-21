const db = require("../models");

const { Restaurante } = require('../models/restaurante.model.js');

const Mesa = db.Mesa;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    // crea una mesa
    const mesa = {
        nombre_mesa: req.body.nombre_mesa,
        id_restaurante: req.body.id_restaurante,
        posicion_x: req.body.posicion_x,
        posicion_y: req.body.posicion_y,
        planta: req.body.planta || 1,
        capacidad: req.body.capacidad,
    };
    // Guardamos a la base de datos
    Mesa.create(mesa)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear una mesa."
        });
    });
};

exports.findAll = (req, res) => {
  Mesa.findAll({
    include: [{
      model: db.Restaurante,
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al obtener las mesas.",
      });
    });
};


// exports.findAll = (req, res) => {
//   Mesa.findAll({
//     include: {
//       model: Restaurante,      
//       required: true // this specifies that it's an inner join

//     }
//   })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Ocurrió un error al obtener las mesas."
//       });
//     });
// };
  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Mesa.findByPk(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `No se encontró la mesa con id=${id}.`
          });
        } else {
          res.send(data);
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al obtener la mesa con id=" + id
        });
      });
  };
  
exports.update = (req, res) => {
    const id = req.params.id;
    Mesa.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "La mesa fue actualizado exitosamente."
          });
        } else {
          res.send({
            message: `No se pudo actualizar la mesa con id=${id}. Tal vez la mesa no fue encontrada o los datos de la solicitud están vacíos.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al actualizar la mesa con id=" + id
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Mesa.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "La mesa fue eliminado exitosamente."
          });
        } else {
          res.send({
            message: 'No se pudo eliminar la mesa con id=${id}. Tal vez la mesa no fue encontrado.'
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al eliminar la mesa con id=" + id
        });
      });
  };