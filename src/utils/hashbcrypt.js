//BCRYP: es una libreria de hashing para contraseñas

//1) Instalamos con : npm i bcrypt
//2) Importamos el modulo: 

import bcrypt from "bcrypt"; 

//Se crearan dos funciones: 
//a) createHash: aplica el hash al password. 
//b) isValidPassword: compara el password ingresado con el almacenado en la base de datos. 

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 

//hashSync: toma el password que le pasamos y aplica el proceso de haseho a partir de un "salt". 

//Un "salt" es un string randomque hace que el proceso se realice de forma impredecible. 

//genSaltSync(10): generar un salt de 10 caracteres. 
//ESTE PROCESO ES IRREVERSIBLE!!! AHH VAMOS A MORIR!!!

const isValidPassword = ( password, user ) => bcrypt.compareSync(password, user.password); 
//Compara los password y retorna tru o falsete segun corresponda. 

export {createHash, isValidPassword}; 