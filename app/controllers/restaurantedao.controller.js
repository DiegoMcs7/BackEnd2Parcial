const db = require("../models");
const Restaurante = db.Restaurante;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    // crea un restaurante
    const restaurante = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
    };
    // Guardamos a la base de datos
    Restaurante.create(restaurante)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear un restaurante."
        });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    
    Restaurante.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener restaurante con id=" + id
        });
    });
};

exports.findAll = (req, res) => {
    const nombre = req.query.nombre;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Restaurante.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;
    Restaurante.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "El restaurante fue actualizado exitosamente."
          });
        } else {
          res.send({
            message: `No se pudo actualizar el restaurante con id=${id}. Tal vez el restaurante no fue encontrado o los datos de la solicitud están vacíos.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al actualizar el restaurante con id=" + id
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Restaurante.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "El restaurante fue eliminado exitosamente."
          });
        } else {
          res.send({
            message: `No se pudo eliminar el restaurante con id=${id}. Tal vez el restaurante no fue encontrado.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al eliminar el restaurante con id=" + id
        });
      });
  };