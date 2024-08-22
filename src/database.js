import mongoose from "mongoose"; 

//2) Usamos el metodo connect para vincular la BD: 

mongoose.connect("mongodb+srv://g18delatorre:jEnoQgieIPLiRAJA@backenduno.ce2xng0.mongodb.net/ecommerce")
    .then( () => console.log("Conexion exitosa!")) 
    .catch( (error) => console.log("Vamos a morir, tenemos un error", error))