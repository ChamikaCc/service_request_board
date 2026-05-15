import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // check token exists in header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("No token, unauthorized");
      err.status = 401;
      return next(err);
    }

    //extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user from token
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      const err = new Error("User no longer exists");
      err.status = 401;
      return next(err);
    }

    //attach user to request
    req.user = user;

    next(); // allow to continue
  } catch (err) {
    err.status = 401;
    next(err);
  }
};