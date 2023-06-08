module.exports = app => {

    const categoria = require("../controllers/categoriadao.controller.js");
    var router = require("express").Router();
    router.post("/", categoria.create);  
    router.get("/", categoria.findAll);
    router.get("/:id", categoria.findOne); 
    router.put("/:id", categoria.update); 
    router.delete("/:id", categoria.delete); 
    app.use('/api/categoria', router);
    
};