import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import "./database.js";
import ProductManager from "./dao/fs/product-manager.js";
import sessionRouter from "./routes/sessions.router.js";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
const app = express();
const PUERTO = 8080;
const productManager = new ProductManager("./src/models/productos.json");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public")); 
app.use(express.urlencoded({extended: true}));
app.use (cookieParser()),
app.use(session({
    secret: "secretCoder", 
    resave: true, 
    saveUninitialized: true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://g18delatorre:jEnoQgieIPLiRAJA@backenduno.ce2xng0.mongodb.net/Login"
    })
}))

//Express-Handlebars
app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 


///Cambios con passport: 
initializePassport(); 
app.use(passport.initialize()); 
app.use(passport.session()); 


// Rutas
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log('Servidor escuchando en el puerto ${PUERTO}');
});



const io = new Server(httpServer); 


io.on("connection", async (socket) => {
    console.log("Un cliente se conecto"); 

    //Enviamos el array de productos: 
    socket.emit("productos", await productManager.getProducts());

    //Recibimos el evento "eliminarProducto" desde el cliente: 
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

        //Enviamos lista actualizada al cliente: 
        io.sockets.emit("productos", await productManager.getProducts());
    })

    //Agregamos productos por medio de un formulario: 
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto); 
        //Enviamos la lista actualizada al cliente: 
        io.sockets.emit("productos", await productManager.getProducts());
    })
})