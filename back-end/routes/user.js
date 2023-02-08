const express = require('express'); //importation d'express 

const router = express.Router(); //Création de notre routeur
const userCtrl = require('../controllers/user');

router.get('/coucou', function(){
    console.log("ça passe")
    return ("Ici aussi")
});
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;