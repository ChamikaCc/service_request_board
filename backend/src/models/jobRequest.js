import mongoose from "mongoose";

const JobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    enum: ["Plumbing", "Electrical", "Painting", "Joinery", "Other"],
  },
  location: {
    type: String,
  },
  contactName: {
    type: String,
  },
  contactEmail: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"], // must have @ and domain
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Closed"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("JobRequest", JobRequestSchema);