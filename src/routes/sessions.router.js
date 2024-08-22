import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

const router = Router();

// Ruta para el registro de usuarios
router.post("/register", async (req, res) => {
    const { user, password } = req.body;

    try {
        
        const existingUser = await UserModel.findOne({ user });

        if (existingUser) {
            return res.status(400).send("El usuario ya existe");
        }

        // Creamos el nuevo usuario
        const newUser = new UserModel({
            user,
            password: createHash(password)
        });

        // Guardamos el nuevo usuario
        await newUser.save();

        // Generamos un token JWT
        const token = jwt.sign({ user: newUser.user, role: newUser.role }, "coderhouse", { expiresIn: "1h" });

        // Configuramos la cookie con el token
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true   
        });

        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para el inicio de sesión de usuarios
router.post("/login", async (req, res) => {
    const { user, password } = req.body;

    try {
        // Buscamos al usuario en la base de datos
        const foundUser = await UserModel.findOne({ user });

        // Verificamos si el usuario existe
        if (!foundUser) {
            return res.status(401).send("Usuario no válido");
        }

        // Verificamos la contraseña
        if (!isValidPassword(password, foundUser)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        // Generamos un token JWT
        const token = jwt.sign({ user: foundUser.user, role: foundUser.role }, "coderhouse", { expiresIn: "1h" });

        // Configuramos la cookie con el token
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true   
        });

        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para obtener el usuario actual
router.get("/current", (req, res) => {
    const token = req.cookies["coderCookieToken"];
    if (!token) {
        return res.status(401).send("No autorizado");
    }

    try {
        // Verificamos el token
        const decoded = jwt.verify(token, "coderhouse");
        res.render("home", { user: decoded.user });
    } catch (error) {
        res.status(401).send("Token inválido");
    }
});

// Ruta para cerrar sesión
router.post("/logout", (req, res) => {
    // Limpiamos la cookie del token
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

// Ruta para acceso exclusivo de administradores
router.get("/admin", (req, res) => {
    const token = req.cookies["coderCookieToken"];
    if (!token) {
        return res.status(401).send("No autorizado");
    }

    try {
        // Verificamos el token
        const decoded = jwt.verify(token, "coderhouse");
        if (decoded.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    } catch (error) {
        res.status(401).send("Token inválido");
    }
});

export default router;