const express = require("express"); //importation de express
const app = express();
const mongoose = require("mongoose"); //importation de mongoose
const userRoutes = require("./routes/user"); //Importation des routes pour les users

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

  /*if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    
  }*/
  next();
});

mongoose
  .connect(
    "mongodb+srv://Us3R:Dp2srIK419BQzEgM@cluster0.sc1vhjy.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.get("/", function (req, res) {
  res.send("hello world");
});

app.use("api/auth", userRoutes);
console.log("🚀 ~ file: app.js:35 ~ userRoutes", userRoutes);

module.exports = app;
