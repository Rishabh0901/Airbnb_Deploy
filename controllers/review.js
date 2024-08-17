// This file we have created so that we can shift the code of asynchronous callback of routes of review i.e. in 
// "routes -> review.js" file. We are implementing MVC model to make our code presentable.

const Review = require('../models/review');
const Listing = require('../models/listing');

/*Review Save code shifted.*/
// We have created the createReview function so that we can shift the Review Save asynchronous callback code from /*Review Save*/
// of "routes -> review.js" file, here.
module.exports.createReview = async(req, res)=>{
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // This will store the id of the user who is creating review into author property of Review schema.
    listing.reviews.push(newReview);
    // console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};



/*Review delete code shifted.*/
// We have created the destroyReview function so that we can shift the Review Delete asynchronous callback code from /*Review Delete*/
// of "routes -> review.js" file, here.
module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});// Here we are deleteing the review Id from the listing model/database also. For that we use specaial operator of mongoose i.e. "$pull" operator.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};