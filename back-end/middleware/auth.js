const jwt = require("jsonwebtoken"); //Importation du module JWT JSON WEB TOKEN
const envVariable = require("dotenv").config(); //Importation de dotenv pour pouvoir utiliser le .env

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // récupération du contenu du authorization dans le header (split pour recuperer apres l'espace)
    const decodedToken = jwt.verify(token, process.env.JWTTOKEN); // décodage du token
    const userId = decodedToken.userId; //récupération de l'id utilisateur
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
