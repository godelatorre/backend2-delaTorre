import mongoose from "mongoose"; 

//2) Usamos el metodo connect para vincular la BD: 

mongoose.connect("mongodb+srv://g18delatorre:jEnoQgieIPLiRAJA@backenduno.ce2xng0.mongodb.net/ecommerce")
    .then(() => console.log("Conexión con la base de datos establecida con éxito."))
    .catch((error) => console.error("Se ha producido un error al intentar conectar con la base de datos:", error));
