const express = require("express"); //importation de express
const app = express();
app.use(express.json()); // Permet d'exploiter la réponse du front-end au format Json
const mongoose = require("mongoose"); //importation de mongoose
const userRoutes = require("./routes/user"); //Importation des routes pour les users
const stuffRoutes = require("./routes/stuff"); //Importation des routes pour les stuffs
const path = require("path");
const envVariable = require("dotenv").config(); //importation du pluggin dotenv pour pouvoir utiliser le .env

//MONGOOSE CONNECTION

mongoose
  .connect(process.env.DB_CONNEXION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// GESTION DES CORS POLICY

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", stuffRoutes);
module.exports = app;
