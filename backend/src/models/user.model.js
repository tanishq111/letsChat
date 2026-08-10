import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) { // if you are not modifying the password, then just move to the next middleware. This is important because if you are updating other fields of the user, you don't want to hash the password again.
    return ;
  }
  this.password = await bcrypt.hash(this.password, 10);
  return;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
 