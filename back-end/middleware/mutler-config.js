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
    console.log("destination");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    callback(null, shortid.generate() + "." + extension); //utilisation de shortId pour generer un nom de fichier
    console.log("filename");
  },
});

// Ajout de fileFilter pour autoriser seulement les JPG JPEG PNG
const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    console.log("fileFilter1");
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      console.log("fileFilter2");
      callback(null, true);
    } else {
      callback(null, false);
      console.log("fileFilter3");
      return callback(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

module.exports = upload.single("image");
