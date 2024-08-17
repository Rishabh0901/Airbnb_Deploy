// This file we have created so that we can shift the code of asynchronous callback of routes of listing i.e. in 
// "routes -> lsiting.js" file. We are implementing MVC model to make our code presentable.


// This below code we have taken from "https://github.com/mapbox/mapbox-sdk-js"
const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


/*Index Route code shifted.*/
// We have created the index function so that we can shift the index route asynchronous callback code from /*Index Route*/
// of "routes -> lsiting.js" file, here.
module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    // res.send('working');
};


/*New Route code shifted.*/
// We have created the renderNewForm function so that we can shift the new route asynchronous callback code from /*New Route*/
// of "routes -> lsiting.js" file, here.
module.exports.renderNewForm = async (req, res)=>{
// console.log(req.user);
/*We have shifted the below code in new file middleware.js in isLoggedIn function.*/
// if(!req.isAuthenticated())// Here, we are authenticating that user has already logged in or not and if user has not 
                             // logged in then give a flash error message and do not open the new listing from.
// {
//     req.flash("error", "You must be logged in to create listing!");
//     return res.redirect('/login');
// }
res.render("listings/new.ejs");
};



/*Show Route code shifted.*/
// We have created the showListing function so that we can shift the Show route asynchronous callback code from /*Show Route*/
// of "routes -> lsiting.js" file, here.
module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: 'reviews', // Here, we are populating listing with all the reviews
        populate: {// Here we, have created nested populate where we have populated each review wiwth author using path.
            path: 'author',
        },
    }) 
    .populate('owner') // Here, we are populating listing with owner so that we can display the name of user who has created the listing.
    if(!listing)// this will display a flash message instead of an error message when someone tries to visit a listing that has already been deleted.
    {
        req.flash('error', 'Listing you requested does not exist!');
        res.redirect('/listings');
    };
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};





/*Create Route code shifted.*/
// We have created the showListing function so that we can shift the Create route asynchronous callback code from /*Create Route*/
// of "routes -> lsiting.js" file, here.
module.exports.createListing = async (req, res, next)=>{ 
    // let {title, description, image, price, location, country} = req.body; // We will not fetch data like this instead we will make changes in new.ejs file.
                                                                             //   <input name="listing[title]" placeholder="enter title" type="text"/> //name="listing[title]" we will be writing this beacuse we are making them as a object i.e. listing here and key title.
                                                                             //   So, we are making key value pair of lsiting object.
                                                                             //   We wil same for rest all like description, image, price, location, country, etc.
    // We are not doing above thing and changing in new.ejs file. So that our code beccomes easy.

    // let listing = req.body.listing;
    // new Listing(listing);
    // console.log(listing);                                                                         

    // if(!req.body.listing)
    //     {
    //         throw new ExpressError(400, "Send valid data for listing"); // 400- status code states a bad request i.e. due to mistake made by client server can't handle the request.
                                                                           // This error can come if you send a POST request to "http://localhost:8080/listings" by hoppscotch but there is no data for listings.
    //     }


    //So, one way to apply validation for each field is to write if condition for each fields and throw error with individual messages.
    // if(!newListing.description)
    //     {
    //         throw new ExpressError(400, "description is missing");
    //     }
    // if(!newListing.title)
    //     {
    //         throw new ExpressError(400, "title is missing"); 
    //     }
    // if(!newListing.location)
    //     {
    //         throw new ExpressError(400, "location is missing"); 
    //     }
    // if(!newListing.country)
    //     {
    //         throw new ExpressError(400, "country is missing"); 
    //     }

    // But we will not use above method for validating our fiels of server side schema. We will use "Joi" i.e. an npm package for defining server side schema.
    // For that we have made file schema.js
    //We have commented this because we have defined this code above in validateListing function.
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error)
    //     {
    //         throw new ExpressError(404, result.error); // Throwing error generated by Joi.
    //     }

    //This code is taken from- "https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode-1"
    // For forward geocoding of address to co-ordinates. for our maps.
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1// This limit defines that how many co-ordinates we will get back after the forward geocoding is done for one 
                // location. For example new delhi is a big location and it will have more than one coordinates. But we 
                // will only take one co-ordinate.
      })
    .send();


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);// listing is the object that we have created in new.ejs file.
    // console.log(newListing);
    // console.log(req.user);
    newListing.owner = req.user._id;// Whenever we are creating a new listing we have to add a owner with it. We will 
                                    // take this information from req.user object which is stored by passport.
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};




/*Edit Route code shifted.*/
// We have created the renderEditForm function so that we can shift the Edit route asynchronous callback code from /*Edit Route*/
// of "routes -> lsiting.js" file, here.
module.exports.renderEditForm = async (req, res)=>{//
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing)// this will display a flash message instead of an error message when someone tries to visit a listing edit page that has already been deleted.
    {
        req.flash('error', "Listing you want to edit requested does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render('listings/edit.ejs', { listing, originalImageUrl }); 
};



/*Update Route code shifted.*/
// We have created the updateListing function so that we can shift the Update route asynchronous callback code from /*Update Route*/
// of "routes -> lsiting.js" file, here.
module.exports.updateListing = async (req, res)=>{ 
    if(!req.body.listing)
        {
            throw new ExpressError(400, "Send valid data for listing"); // 400- status code states a bad request i.e. due to mistake made by client server can't handle the request.
                                                                        // This error can come if you send a POST request to "http://localhost:8080/listings" but there is no data for listings.
        }
    let { id } = req.params;

    //This below whole code we are shifting and making a middleware for this in middleware.js file so that we don't have 
    // to write this part code everywhere again adn again.
    // In below findByIdAndUpdate line we are finding the listing in database and updating it at the same time.
    // let listing = await Listing.findById(id); // Now here, we will break the findByIdAndUpdate into two parts first we will
                                                 // find the listing and then check that the user who is trying to update is
                                                 // the the owner of the listing or not. If the user is not the owner then 
                                                 // updation will not be allowed. else updation it will be allowed.
    // if(!listing.owner.equals(res.locals.currUser._id))
    // {
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); // we are passing a object in which we are 
                                                                              // deconstructing and converting all the values 
                                                                              // that req.body have so that we can store in the 
                                                                              // database.
    if(typeof req.file != "undefined"){// We have added this "if" so that if the req.file object has a value then only file get below process 
                                       // should happen. Else, it should'nt happen.
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${ id }`);
};




module.exports.destroyListing = async(req,  res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log('Listing got deleted');
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};