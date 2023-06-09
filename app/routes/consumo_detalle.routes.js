module.exports = app => {

    const detalle = require("../controllers/consumo_detalledao.controller.js");
    var router = require("express").Router();
    router.post("/", detalle.create);  
    router.get("/", detalle.findAll);
    app.use('/api/detalle', router);
    
};