const db = require("../models");
const Cliente = db.Cliente;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    // crea un cliente
    const cliente = {
        ci: req.body.ci,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
    };
    // Guardamos a la base de datos
    Cliente.create(cliente)
        .then(data => {
            console.log("Cliente creado", cliente);
            res.send(data);
        })
        .catch(err => {
            console.log("Error al crear");
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el cliente."
        });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    
    Cliente.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener cliente con id=" + id
        });
    });
};

exports.findAll = (req, res) => {
    const ci = req.query.ci;
    var condition = ci ? { ci: { [Op.eq]: ci } } : null;
  
    Cliente.findAll({ where: condition })
      .then(data => {
        console.log("Lista de clientes", data);
        res.send(data);
      })
      .catch(err => {
        console.log("Error al obtener clientes");
        res.status(500).send({
          message:
            err.message || "Ocurrio un error al obtener los clientes."
        });
      });
  };
  