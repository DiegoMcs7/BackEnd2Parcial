module.exports = app => {

    const restaurante = require("../controllers/restaurantedao.controller.js");
    var router = require("express").Router();
    router.post("/", restaurante.create);  
    router.get("/", restaurante.findAll);
    router.get("/:id", restaurante.findOne); 
    router.put("/:id", restaurante.update); 
    router.delete("/:id", restaurante.delete); 
    app.use('/api/restaurante', router);
    
};