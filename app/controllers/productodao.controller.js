const db = require("../models");
const Producto = db.Producto;
const Categoria = db.Categoria;
// CREATE
exports.create = (req, res) => {
  // Verificar que la categoria exista
  Categoria.findByPk(req.body.id_categoria)
    .then(categoria => {
      if (!categoria) {
        res.status(400).send({
          message: `No se encontró una categoria con id=${req.body.id_categoria}.`
        });
        return;
      }

      // Crear el producto
      const producto = {
        nombre_producto: req.body.nombre_producto,
        id_categoria: req.body.id_categoria,
        precio: req.body.precio
      };

      // Guardar el producto en la base de datos
      Producto.create(producto)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Ocurrió un error al crear el producto."
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al buscar la categoria."
      });
    });
};

exports.findAll = (req, res) => {
    Producto.findAll({
      include: [{
        model: db.Categoria,
      }]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrió un error al obtener los productos.",
        });
      });
  };
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Producto.findByPk(id, {
        include: [{
          model: db.Categoria,
        }]
      })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `No se encontró un producto con id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: `Ocurrió un error al obtener el producto con id=${id}.`
        });
      });
  };
exports.update = (req, res) => {
    const id = req.params.id;
    Producto.update(req.body, {
        where: { id: id }
    })
        .then(num => {
        if (num == 1) {
            res.send({
            message: "El producto fue actualizado exitosamente."
            });
        } else {
            res.send({
            message: `No se pudo actualizar el producto con id=${id}. Tal vez el producto no fue encontrada o los datos de la solicitud están vacíos.`
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Error al actualizar el producto con id=" + id
        });
        });
};
exports.delete = (req, res) => {
    const id = req.params.id;
    Producto.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "El producto fue eliminada exitosamente."
          });
        } else {
          res.send({
            message: `No se pudo eliminar el producto con id=${id}. Tal vez el producto no fue encontrada.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al eliminar el producto con id=" + id
        });
      });
  };