/*This file we have created so that we can put all code of user signup and login route here. */

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync")
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');
const userController = require("../controllers/user.js"); // We have required this because, due to MVC we have shifted 
const user = require('../models/user.js');
                                                              // all the the code of asynchronous callback of routes of 
                                                              // user in "controllers -> user.js" file.

                                                              
//We will write signup both get and post route together using router.route because, they both are having same path:- '/signup'.
//routes for signup
router
    .route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));


                                                              
//We will write login both get and post route together using router.route because, they both are having same path:- '/login'.
//routes for login
router  
    .route('/login')
    .get(userController.renderLoginForm)
    .post( 
    saveRedirectUrl,// calling saveRedirectUrl middleware just before the login authentication because, it will first save the 
                    // originalUrl and then authenticate the login user.
    passport.authenticate('local', {// Here we have to authenticate user i.e. check that user has already signed up or not 
                                    // and this work will be done by passport package as middleware using authenticate method.
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.login,
);



//routes for logout
router.get('/logout', userController.logout);


module.exports = router;