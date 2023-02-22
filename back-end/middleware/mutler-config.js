const multer = require("multer"); //Appel du plugin multer
const shortid = require("shortid"); //Appel du plugin shortID car nanoID utilise import et non require

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    callback(null, shortid.generate() + "." + extension); //utilisation de shortId pour generer un nom de fichier
  },
});

module.exports = multer({ storage: storage }).single("image");
