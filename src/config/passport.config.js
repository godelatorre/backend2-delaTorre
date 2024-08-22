import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils/hashbcrypt.js';
import CartManager from '../dao/db/cart-manager-db.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    // Estrategia para el registro
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            const cartManager = new CartManager();
            const cart = await cartManager.crearCarrito();

            let user = await UserModel.findOne({ email: email });
            if (user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                cart: cart._id,  // Aquí se asigna el ID del carrito al usuario
                email,
                age,
                password: createHash(password)
            };

            let result = await UserModel.create(newUser);

            return done(null, result);

        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia para el login
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                console.log('Este usuario no existe ahhhhh auxilio!');
                return done(null, false);
            }

            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia JWT
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['coderCookieToken'];
        }
        return token;
    };

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'coderhouse'
    }, async (jwt_payload, done) => {
        try {
            // Aquí puedes buscar el usuario en la base de datos usando el id del payload
            const user = await UserModel.findById(jwt_payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serialización y deserialización
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;