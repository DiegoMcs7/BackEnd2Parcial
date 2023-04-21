const db = require("../models");
const Mesa = db.Mesa;
const Restaurante = db.Restaurante;
// CREATE
exports.create = (req, res) => {
  // Verificar que el restaurante exista
  Restaurante.findByPk(req.body.id_restaurante)
    .then(restaurante => {
      if (!restaurante) {
        res.status(400).send({
          message: `No se encontró un restaurante con id=${req.body.id_restaurante}.`
        });
        return;
      }

      // Crear la mesa
      const mesa = {
        nombre_mesa: req.body.nombre_mesa,
        id_restaurante: req.body.id_restaurante,
        posicion_x: req.body.posicion_x,
        posicion_y: req.body.posicion_y,
        planta: req.body.planta || 1, // Valor por defecto
        capacidad: req.body.capacidad
      };

      // Guardar la mesa en la base de datos
      Mesa.create(mesa)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Ocurrió un error al crear la mesa."
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al buscar el restaurante."
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
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Mesa.findByPk(id, {
        include: [{
          model: db.Restaurante,
        }]
      })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `No se encontró una mesa con id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: `Ocurrió un error al obtener la mesa con id=${id}.`
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
            message: "La mesa fue actualizada exitosamente."
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
            message: "La mesa fue eliminada exitosamente."
          });
        } else {
          res.send({
            message: `No se pudo eliminar la mesa con id=${id}. Tal vez la mesa no fue encontrada.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al eliminar la mesa con id=" + id
        });
      });
  };