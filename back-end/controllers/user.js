const User = require('../models/user'); // Importation de notre model de donnée utilisateur
const bCrypt = require('bcrypt'); // Importation de notre outil de hashage


exports.signup = (req, res, next) => {
    bCrypt.hash(req.body.password, 10) //Hashage du mot de passe, on recupere le passeword dans la requete puis on vient le hasher 10X
    .then(hash => {
        const user = new User({ //création de notre nouvel user
            email: req.body.email, // on récupére l'email dans le body de la requete 
            password: hash //le mot de passe sera le hash généré par bCrypt 
        });
        user.save() //on enregistre l'utilisateur dans la BDD
        .then(() => res.status(201).json ({message: 'Utilisateur bien créé dans la BDD'})) //status 201 ok  
        .catch(error => res.status(400).json ({error})); //Si erreur alors erreur 400(erreur serveur)
        
    })
    .catch(error => res.status(500).json ({error})); //Si erreur alors erreur 500(erreur serveur)
    
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) //on cherche dans la BDD si un user existe avec cette adresse email
    .then(user => {
        if (user === null) {res.status(401).json({message:'Identifiant/Mot de passe incorrect.'}) //Si aucune occurence trouvé dans le BDD alors affichage du message d'erreur 
 
        } else {
            bCrypt.compare(req.body.password, user.password) // Ici bcrypt compare le hash contenu dans la BDD avec le mot de passe que l'utilisateur à taper sur la page de connexion
            .then(valid => {
                if(!valid) { // Si valide retourne False (donc pas identique alors...)
                   res.status(401).json({message:'Identifiant/Mot de passe incorrect.'}) //Si le mot de passe est pas identique alors affichage du message d'erreur 
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    })
                }

                })
            .catch(error => res.status(500).json ({error}));//Si erreur alors erreur 500(erreur serveur)
        }
    })
    .catch(error => res.status(500).json ({error}));//Si erreur alors erreur 500(erreur serveur)
    
};
