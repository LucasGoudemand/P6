const mongoose = require('mongoose'); //importation de mongoose

const uniqueValidator = require('mongoose-unique-validator'); //importation du plugin mongoose-unique-validator qui verbose correctement les erreurs Mongoose

//Création de notre Schéma Utilisateur
const userSchema = mongoose.Schema({
    email: { type:String, require: true, unique: true},
    password: { type:String, require: true}
});

//Application de notre plugin UValidator sur notre Schema User
userSchema.plugin(uniqueValidator);

//Exportation de notre Schéma en tant que model de données.
module.exports = mongoose.model('User', userSchema);