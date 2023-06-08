module.exports = app => {

    const cabecera = require("../controllers/consumo_cabeceradao.controller.js");
    var router = require("express").Router();
    router.post("/", cabecera.create);  
    router.get("/", cabecera.findAll);
    app.use('/api/cabecera', router);
    
};