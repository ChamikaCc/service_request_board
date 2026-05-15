import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"], // must have @ and domain
 
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/.test(value);
      },
      message:
        "Password must have at least one uppercase, lowercase and a number",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);