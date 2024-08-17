// This file we have created so that we can shift the code of asynchronous callback of routes of user i.e. in 
// "routes -> user.js" file. We are implementing MVC model to make our code presentable.

const User = require('../models/user.js')


/*routes for signup 'get' code shifted.*/
// We have created the renderSignupForm function so that we can shift the "routes for signup 'get'" asynchronous callback code from 
// /*routes for signup 'get'*/ of "routes -> user.js" file, here.
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};


/*routes for signup 'post' code shifted.*/
// We have created the signup function so that we can shift the "routes for signup 'post'" asynchronous callback code from 
// /*routes for signup 'post'*/ of "routes -> user.js" file, here.
module.exports.signup = async(req, res)=>{
    try {
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => { // This part of code will make user directly login after signup without doing 
                                       // login seperately. 
                                       // this code is written here because, in just above line user is becoming a 
                                       // registered user i.e. user information is getting stored in the database.
                                       // And we will directly login the user just after the information saved into 
                                       // database by signup.
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Homely!");
        res.redirect("/listings");
    });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect('/signup');
    }   
};


/*routes for login 'get' code shifted.*/
// We have created the renederLoginForm function so that we can shift the "routes for login 'get'" asynchronous callback 
// code from /*routes for login 'get'*/ of "routes -> user.js" file, here.
module.exports.renderLoginForm = (req, res)=>{
    res.render('users/login.ejs');
};


/*routes for login 'post' code shifted.*/
// We have created the login function so that we can shift the "routes for login 'post'" asynchronous callback 
// code from /*routes for login 'post'*/ of "routes -> user.js" file, here.
module.exports.login = async(req, res)=>{
    // res.send('Welcome to Homely! You are logged in!');
    req.flash('success', 'Welcome back to Homely');
    // res.redirect(req.session.redirectUrl);// Here, passport will create a problem because, after successful login passport
                                          // bfdefault reset the req.session object and will become undefined. So, the value 
                                          // 'originalUrl' that we have stored in 'req.session.redirectUrl' object will get 
                                          // deleted. So we will save the 'originalUrl' value into locals variable in 
                                          // middleware.js file which are accessable everywhere and passport don't have access to 
                                          // delete locals variable.
    // res.redirect(res.locals.redirectUrl); // Why we have used locals is written in just above comment.

let redirectUrl = res.locals.redirectUrl || '/listings';// Because, when we are doing direct login for all listings page the,
                                                        // 'res.locals.redirectUrl' is empty/ undefined because originalUrl is 
                                                        // empty as, we are not wanting to get redirected on particular page.
                                                        // So, isLoggedIn middleware is not getting triggered.
                                                        // Here if, 'res.locals.redirectUrl' will have a value then it will get
                                                        // saved to redirectUrl or else '/listings' will get saved to redirectUrl.
res.redirect(redirectUrl);
};


/*routes for logout 'get' code shifted.*/
// We have created the logout function so that we can shift the "routes for logout 'get'" asynchronous callback 
// code from /*routes for logout 'get'*/ of "routes -> user.js" file, here.
module.exports.logout = (req, res, next) => {
    req.logout((err) => {// This req.logout method takes callback as a parameter(that will define after logout what must be 
                         // done). Here, we are defining an error parameter and if there is an error while logout then the 
                         // error will get stored to this error parameter else it will remain undefined.
    if(err) {
        return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect('/listings');
    })
};