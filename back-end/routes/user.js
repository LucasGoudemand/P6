const express = require('express'); //importation d'express 

const router = express.Router(); //Création de notre routeur
const userCtrl = require('../controllers/user');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);



module.exports = router;