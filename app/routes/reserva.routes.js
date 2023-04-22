module.exports = app => {

    const reserva = require("../controllers/reservadao.controller.js");
    var router = require("express").Router();
    router.post("/", reserva.create);  
    router.get("/", reserva.findAll);
    app.use('/api/reserva', router);
    
};