const Thing = require("../models/thing");
const fs = require("fs");

//GESTION DE LA CREATION DE SAUCE

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce); // On transforme la réponse du front END en objet JSON
  delete thingObject._id; // On supprime l'ID créé par Express
  delete thingObject._userId; // idem pour l'userID
  const thing = new Thing({
    //avec notre model de donné précédement créé on créé l'objet thing qui récupére les infos dans le body de la requete
    name: thingObject.name,
    manufacturer: thingObject.manufacturer,
    description: thingObject.description,
    mainPepper: thingObject.mainPepper,
    heat: thingObject.heat,
    userId: req.auth.userId, //on récupére l'id utilisateur avec notre jeton (TOKEN)
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // On indique le chemin ou notre photo a été stocké
    //req.protocol = http :// req.get.host = localhost:3000 /images/ et le nom du fichier
  });
  thing
    .save() // On enregistre l'objet thing dans la BDD
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//GESTION DE L'AFFICHAGE DE UNE SAUCE
exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    // On récupére dans la BDD l'objet avec l'id correspondant
    _id: req.params.id,
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//GESTION DE LA MODIFICATION D'UN SAUCE

exports.modifyThing = (req, res, next) => {
  const thingObject = req.body; //on récupére les infos dans la réponse du front
  const thing = new Thing({
    //avec notre model de donné précédement créé on créé l'objet thing qui récupére les infos dans le body de la requete
    name: thingObject.name,
    manufacturer: thingObject.manufacturer,
    description: thingObject.description,
    mainPepper: thingObject.mainPepper,
    heat: thingObject.heat,
    userId: req.auth.userId, //on récupére l'id utilisateur avec notre jeton (TOKEN)
    _id: req.params.id, //par ce que node rajoute à chaque fois un nouvel ID donc on recupére celui qui est passé dans les parametres lors du clic utilisateur
  });
  if (req.file) {
    thing.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    Thing.findOne({ _id: req.params.id }).then((itemFoundInBdd) => {
      if (itemFoundInBdd.userId !== req.auth.userId) {
        //On verifie que l'utilisateur ID coorespond bien avec l'id contenu dans le token
        res.status(401).json({ message: "Not authorized" });
        return;
      }
      const filenameToDelete = itemFoundInBdd.imageUrl.split("/images/")[1]; // On récupére le nom de l'image à supprimer depuis la bdd
      fs.unlink(`images/${filenameToDelete}`, () => {
        console.log("Img deleted from the API");
      });
    });
  }
  Thing.updateOne({ _id: req.params.id }, thing)
    .then(
      // On mais à jour dans la BDD l'objet qui à la même ID
      () => {
        res.status(201).json({
          message: "Thing updated successfully!",
        });
      }
    )
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//GESTION DE LA SUPPRESSION

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }) //on récupére l'objet dans la BDD qui correspond à l'ID
    .then((thing) => {
      if (thing.userId !== req.auth.userId) {
        //On verifie que l'utilisateur ID coorespond bien avec l'id contenu dans le token
        res.status(401).json({ message: "Not authorized" });
        return;
      }
      const filename = thing.imageUrl.split("/images/")[1]; // On récupére le nom de l'image à supprimer
      fs.unlink(`images/${filename}`, () => {
        //suppréssion de l'image avec le plugin FS (file system)
        Thing.deleteOne({ _id: req.params.id }) //suppression de l'item dans la BDD avec l'id
          .then(() => {
            res.status(200).json({ message: "Objet supprimé !" });
          })
          .catch((error) => res.status(401).json({ error }));
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// GESTION AFFICHAGE GENERAL DES SAUCES

exports.getAllStuff = (req, res, next) => {
  Thing.find()
    .then(
      // On récupére all objets dans la BDD
      (things) => {
        res.status(200).json(things);
      }
    )
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// GESTION DES LIKES / DISLIKE

exports.liked = (req, res, next) => {
  if (req.body.like === 1) {
    Thing.findOne({ _id: req.params.id }).then((foundItem) => {
      if (!foundItem.usersLiked.includes(req.body.userId)) {
        Thing.updateOne(
          { _id: req.params.id },
          {
            $push: { usersLiked: req.body.userId },
            $inc: { likes: 1 },
          }
        )
          .then(() => {
            res.status(200).json({ message: "Like ajouté" });
          })
          .catch((error) => res.status(401).json({ error }));
      } else {
        res.status(401).json({ error: "Utilisateur a déjà aimé cet objet" });
      }
    });
  } else if (req.body.like === 0) {
    Thing.findOne({ _id: req.params.id }).then((foundItem) => {
      if (foundItem.usersLiked.includes(req.body.userId)) {
        Thing.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersLiked: req.body.userId },
            $inc: { likes: -1 },
          }
        )
          .then(() => {
            res.status(200).json({ message: "Like supprimé" });
          })
          .catch((error) => res.status(401).json({ error }));
      } else {
        Thing.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: -1 },
          }
        )
          .then(() => {
            res.status(200).json({ message: "Dislike supprimé" });
          })
          .catch((error) => res.status(401).json({ error }));
      }
    });
  } else if (req.body.like === -1) {
    Thing.findOne({ _id: req.params.id }).then((foundItem) => {
      if (!foundItem.usersDisliked.includes(req.body.userId)) {
        Thing.updateOne(
          { _id: req.params.id },
          {
            $push: { usersDisliked: req.body.userId },
            $inc: { dislikes: 1 },
          }
        )
          .then(() => {
            res.status(200).json({ message: "Dislike ajouté" });
          })
          .catch((error) => res.status(401).json({ error }));
      } else {
        res.status(401).json({ error: "Utilisateur a déjà dislike cet objet" });
      }
    });
  }
};
