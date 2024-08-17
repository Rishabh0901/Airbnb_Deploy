
/*we will not write the connection code of mongodb here again because, this will get require in main index.js file where we have written the connection code. 
So we will not repeat that again.*/
/*But we will require mongooose here.*/


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require('./user.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,
    
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        // default: "https://unsplash.com/photos/green-leafed-tree-surrounded-by-fog-during-daytime-S297j2CsdlM",
        // set: (v)=> v === "" ? "deafult link" : v,
        url: {
            type: String,
            set: (v) => 
                v === "" 
                ? "https://images.unsplash.com/photo-1592743263126-bb241ee76ac7?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"// default link of image.
                : v    
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }, 
    ],
    owner: { // We are adding owner property with each listing so that we can add functionality of authorization for edit 
            // and delete listing so that the particular owner of the listing can only edit and delete the listing.
            // Each listing will have a single owner and owner will refer to user schema i.e. "models -> user.js" file.
            // Because, owner of listing must also be a registered user.
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {// This will store the coordinates of the location by forward geocoding in the format of geoJSON format.
        type: {
            type: String, // Don't do `{location: {type: Strig}}`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});


//So that on deleting a listing all reviews related to that listing also get deleted.
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing)
        {
            await Review.deleteMany({_id : {$in: listing.reviews}})
        }
});

/*Creating our model and collection*/
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;