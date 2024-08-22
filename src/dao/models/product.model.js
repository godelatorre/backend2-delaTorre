import mongoose from "mongoose";

//schema y model de productos:
const productoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'El precio debe ser un número positivo'] 
    },
    img: {
        type: String
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'El stock debe ser un número no negativo'] 
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    thumbnails: {
        type: [String]
    }
});

// Creamos el modelo
const ProductModel = mongoose.model("Product", productoSchema);

export default ProductModel;



