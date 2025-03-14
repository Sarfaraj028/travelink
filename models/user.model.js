import mongoose, { mongo, plugin } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = mongoose.Schema({
    email:{ 
        type: String,
        required: true,
        lowercase: true
    }
    //do not need to add username and password the passportLocalMongoose do for us.
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)

export default User