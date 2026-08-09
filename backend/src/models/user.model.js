import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
       username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
        password: {
        type: String,
        required: true
      },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
 