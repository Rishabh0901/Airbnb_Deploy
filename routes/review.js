/*This file we have created so that we can put all code of review route here. */

const express = require('express');
const router = express.Router({ mergeParams: true}); // Creting new router object.
                                                     // We have set this "{ mergeParams: true}" to true, so that the parent routr i.e. in app.js
                                                     // "app.use("/listings/:id/reviews", reviews);" So, here "/listings/:id/reviews" is the parent route and the child route is in this review.js file like "/" and "/:reviewId".
                                                     // So, by setting the value to true it will merge the parent route and child route.
                                                     // Refer:- "https://expressjs.com/en/4x/api.html#express.router".

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require("../controllers/review.js"); // We have required this because, due to MVC we have shifted 
                                                              // all the the code of asynchronous callback of routes of 
                                                              // review in "controllers -> review.js" file.


// commenting listingSchema because, we have sfifted the code of validateReview to midlleware.js file. So, here it is of no use now.
// const { reviewSchema } = require('../schema.js'); //requiring validate listingSchema and reviewSchema from schema.js for server-side validation of listings and reviews.



// day51file8 -> we are shifting the validateReview code to middleware.js for making a middleware for it.
// day48file6-> We will make a function validateReview 
// We will use "Joi" i.e. an npm package for defining server side schema.
// For that we have made file schema.js
// const validateReview = (req, res, next)=>{
//     let { error } = reviewSchema.validate(req.body);
//     console.log(error);
//     if(error){
//         let errMsg = error.details.map((element)=> element.message).join(".");
//         throw new ExpressError(404, errMsg);
//     }
//     else{
//         next();
//     };
// };



//Review save
//Post route

// Here, we are removing "/listings/:id/reviews" from the route of both post and delete beacuse this portion is common in
//  both and we will use middleware in app.js to add this route.
router.post(
    "/", 
    isLoggedIn,// Here, isLoggedIn middleware is written so that only loggedIn users can create a review. 
    validateReview, 
    wrapAsync(reviewController.createReview)
);



//Review delete
//Post route

// Here, we are removing "/listings/:id/reviews" from the route of both post and delete beacuse this portion is common in 
// both and we will use middleware in app.js to add this route.

router.delete(
    "/:reviewId", 
    isLoggedIn, // Here, "isLoggedIn" will make sure that only logged in user can delete a review.
    isReviewAuthor, // Here, "isReviewAuthor" will make sure that only author of the review can delete it.
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;