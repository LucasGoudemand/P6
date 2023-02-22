const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // On fait appel à notre middleware d'authentification
const multer = require("../middleware/mutler-config"); //On fait appel à notre middleware pour l'enregistrement d'images
const stuffCtrl = require("../controllers/stuff"); //On fait appel à nos controleurs

router.get("/", auth, stuffCtrl.getAllStuff);
router.post("/", auth, multer, stuffCtrl.createThing);
router.get("/:id", auth, stuffCtrl.getOneThing);
router.put("/:id", auth, multer, stuffCtrl.modifyThing);
router.delete("/:id", auth, stuffCtrl.deleteThing);
router.post("/:id/like", auth, stuffCtrl.liked);
module.exports = router;
