const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    //Here, we have not define the schema for username and password because, passport-Local Mongoose will automatically define them.
});

userSchema.plugin(passportLocalMongoose);// We have used 'passportLocalMongoose' as a plugin so that it can automatically add and 
                                             // implement Username, hashing and salted password.

module.exports = mongoose.model('User', userSchema);