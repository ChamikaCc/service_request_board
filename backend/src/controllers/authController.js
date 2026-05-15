import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// register new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // validate fields
    if (!name || !email || !password) {
      const err = new Error("All fields are required");
      err.status = 400;
      return next(err);
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error("Email already registered");
      err.status = 400;
      return next(err);
    }

    // hash password 
    const hashed = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // create token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// user login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate fields
    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.status = 400;
      return next(err);
    }

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      return next(err);
    }

    // compare password manually
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      return next(err);
    }

    // create token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};