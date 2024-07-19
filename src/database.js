import mongoose from "mongoose"; 

//2) Usamos el metodo connect para vincular la BD: 

mongoose.connect("mongodb+srv://carlaguirin07:Carla0761592@cluster0.tzrap35.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then( () => console.log("Conexion exitosa!")) 
    .catch( (error) => console.log("Vamos a morir, tenemos un error", error))