const db = require("../models");
const Categoria = db.Categoria;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    // crea una categoria
    const categoria = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
    };
    // Guardamos a la base de datos
    Categoria.create(categoria)
        .then(data => {
            console.log("Categoria creada", categoria);
            res.send(data);
        })
        .catch(err => {
          console.log("Error al crear la categoria");
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear una categoria."
        });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    
    Categoria.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener categoria con id=" + id
        });
    });
};

exports.findAll = (req, res) => {
    const nombre = req.query.nombre;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Categoria.findAll({ where: condition })
        .then(data => {
          console.log("Lista de categorias", data);
            res.send(data);
        })
        .catch(err => {
          console.log("Error al listar las categorias");

            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener las categoria."
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;
    Categoria.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "La categoria fue actualizada exitosamente."
          });
        } else {
          res.send({
            message: `No se pudo actualizar la categoria con id=${id}. Tal vez la categoria no fue encontrada o los datos de la solicitud están vacíos.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al actualizar la cateogira con id=" + id
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Categoria.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "La categoria fue eliminada exitosamente."
          });
        } else {
          res.send({
            message: `No se pudo eliminar la categoria con id=${id}. Tal vez la categoria no fue encontrado.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al eliminar la categoria con id=" + id
        });
      });
  };