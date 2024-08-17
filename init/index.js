/*This file will staore the data into database when we run the command "node index.js" by fetching data from data.js and design from listing.js*/

const mongoose = require('mongoose');
const initData = require('./data.js');// requiring all data that is stored in the array sampleListings in "file data.js" in "folder init".
const Listing = require('../models/listing.js');// requiring code of schema for database from models folder.

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log('connection successful wil DB');
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});// Deleting all previous data from database before inserting and initializing any new data.

    // Here, we are wanting to add an owner property to each listing in our already created database i.e. data.js file. We 
    // are accesing initData and applying map function on it. Because, map function creates a new array and then make changes 
    // in it. And here map will add a new property 'owner' to each individual listing object in our existing data. For, 
    // that we will convert the old object to new object in which we will have all properties of old object and a new 
    // owner property will also get added.
    // We are doing this so that manually we don't have to write owner propery in each object of our schema in data.js file. 
    initData.data = initData.data.map((obj) => ({
        ...obj,
         owner: "66a4ce4a1e72aac87411579f"
        }));
    await Listing.insertMany(initData.data);// Inserting data that is there in data.js file in same folder "init".
                                            // initData.data because, in data.js file we have exported object name "data" for sampleListings data array.
    console.log('data was inserted into database');
}

initDB();// calling initDB function so that after exetion of this code the data can be get inserted into database.