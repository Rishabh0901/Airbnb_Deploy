/*We have created this file for writing codes of middleware. */

const Listing = require('./models/listing.js'); // We are requiring this because, we have to use it in isOwner middleware below.
const Review = require('./models/review.js'); // We are requiring this because, we have to use it in isReviewAuthor middleware below.
// we are requiring ExpressError and listingSchema because, we have shifted the code of validateListing from listing.js of
// routes to valiadeListing middleware below.
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js'); // requiring validate listingSchema and reviewSchema from
                                                                //  schema.js for server-side validation of listings and reviews.

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.user);
    // console.log(req);
    // console.log(req.path, '..', req.originalUrl);
    if(!req.isAuthenticated()){// Here, we are authenticating that user has already logged in or not and if user has not 
                              // logged in then give a flash error message and redirect it to login page.
        //Here we will save the redirect originalUrl
        req.session.redirectUrl = req.originalUrl;// So, all the methods & middleware will have access to session object. 
                                                  // So, we can use the originalUrl anywhere.
        req.flash("error", "Please login first!");
        return res.redirect('/login');
    }
    next();
}; 


// This middleware will save the orginalUrl that has been saved into req.session.redirectUrl above into locals variable.
// This is important because, passport will create a problem as, after successful login passport by-default reset the 
// req.session object so it will become undefined. So, the value 'originalUrl' that we have stored in 'req.session.redirectUrl' 
// object will get deleted. So we will save the 'originalUrl' value into locals variable in this middleware which are accessable 
// everywhere and passport don't have access to delete locals variable.
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) { // If, req.session.redirectUrl will have some value then it will get stored into locals variable.
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};



// This middleware we are creating so that we can add authorization to listing and no one from anywhere can edit or delete 
// the listing except the owner of particular listing.
module.exports.isOwner = async(req, res, next)=>{// This isOwner middleware function will check that the user wanting to edit
                                                 // or delete the listing is the owner of the current listing or not.
     let { id } = req.params;

    //This below whole code was written in "listing.js update Route" file and it is now shifted inside a middleware so that we don't have 
    // to write this part of code everywhere again and again.
    let listing = await Listing.findById(id); // Now here, we will break the findByIdAndUpdate into two parts first we will
                                              // find the listing and then check that the user who is trying to update is
                                              // the owner of the listing or not. If the user is not the owner then 
                                              // updation will not be allowed. else updation will be allowed.
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


// This middleware we are creating so that we can add authorization to review and no one from anywhere can delete the 
// review except the author who created it.
module.exports.isReviewAuthor = async (req, res, next) =>{
    let { id, reviewId } = req.params;// Here, we are accessing review id from queryString because in "routes -> middleware.js"
                                  // file our delete route is '/:reviewId'.
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of the review.");
        return res.redirect(`/listings/${ id }`);
    }
    next();
}


// we have shifted the code of validateListing from listing.js file of routes to create a middleware for it.
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error)
        {
            let errMsg = error.details.map((element) => element.message).join(",");
            throw new ExpressError(404, errMsg); // Throwing error generated by Joi.
        }
        else
        {
            next();
        }
};



// we have shifted the code of reviewListing from review.js file of routes to create a middleware for it.
module.exports.validateReview = (req, res, next)=>{
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((element)=> element.message).join(".");
        throw new ExpressError(404, errMsg);
    }
    else{
        next();
    };
};