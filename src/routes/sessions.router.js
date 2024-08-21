import { Router } from "express";
const router = Router();
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

//Importamos passport: 
import passport from "passport";

router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }

    req.session.login = true;

    res.redirect("/products");
})


router.get("/failedregister", (req, res) => {
    res.send("Registro fallido");
})



router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }

    req.session.login = true;

    res.redirect("/products");

})

router.get("/faillogin", (req, res) => {
    res.send("Fallo todo el login!!!"); 
})

//Logout

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})


export default router; 