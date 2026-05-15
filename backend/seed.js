import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import JobRequest from "./src/models/JobRequest.js";

const jobs = [
  {
    title: "Leaking roof during monsoon",
    description: "Roof is leaking badly during heavy rain, need urgent repair before monsoon season gets worse",
    category: "Other",
    location: "Colombo",
    contactName: "Kamal Perera",
    contactEmail: "kamal@gmail.com",
    status: "Open",
  },
  {
    title: "Broken water pump",
    description: "Water pump stopped working, no water supply to the house, need plumber urgently",
    category: "Plumbing",
    location: "Kandy",
    contactName: "Nimal Silva",
    contactEmail: "nimal@gmail.com",
    status: "Open",
  },
  {
    title: "House exterior painting",
    description: "Two storey house exterior needs repainting before Avurudu season, about 1500 square feet",
    category: "Painting",
    location: "Galle",
    contactName: "Sunil Fernando",
    contactEmail: "sunil@gmail.com",
    status: "In Progress",
  },
  {
    title: "Electrical wiring problem",
    description: "Frequent power trips in the house, need electrician to check and fix wiring issue",
    category: "Electrical",
    location: "Negombo",
    contactName: "Chaminda Jayawardena",
    contactEmail: "chaminda@gmail.com",
    status: "Open",
  },
  {
    title: "Bathroom pipe blockage",
    description: "Bathroom drain completely blocked, water not draining, need plumber as soon as possible",
    category: "Plumbing",
    location: "Kurunegala",
    contactName: "Sandya Dissanayake",
    contactEmail: "sandya@gmail.com",
    status: "Open",
  },
  {
    title: "Wooden door repair",
    description: "Main entrance wooden door swollen due to rain and not closing properly, need joiner to fix",
    category: "Joinery",
    location: "Matara",
    contactName: "Ruwan Bandara",
    contactEmail: "ruwan@gmail.com",
    status: "Closed",
  },
  {
    title: "Interior wall painting",
    description: "Three bedroom house interior walls need repainting, currently have water stains from old leak",
    category: "Painting",
    location: "Colombo",
    contactName: "Dilani Rathnayake",
    contactEmail: "dilani@gmail.com",
    status: "Open",
  },
  {
    title: "Solar panel wiring",
    description: "Need electrician to wire newly installed solar panels to home electrical system",
    category: "Electrical",
    location: "Anuradhapura",
    contactName: "Prasad Wijesinghe",
    contactEmail: "prasad@gmail.com",
    status: "In Progress",
  },
  {
    title: "Kitchen cupboard installation",
    description: "Need joiner to install new wooden kitchen cupboards, all materials already purchased",
    category: "Joinery",
    location: "Jaffna",
    contactName: "Kumaran Selvam",
    contactEmail: "kumaran@gmail.com",
    status: "Open",
  },
  {
    title: "Overhead tank leaking",
    description: "Rooftop water tank leaking from bottom, losing water daily, need urgent plumber",
    category: "Plumbing",
    location: "Ratnapura",
    contactName: "Thilaka Gunawardena",
    contactEmail: "thilaka@gmail.com",
    status: "Open",
  },
];

const seedDB = async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // delete existing jobs
    await JobRequest.deleteMany();
    console.log("Deleted existing jobs");

    // insert new jobs
    await JobRequest.insertMany(jobs);
    console.log("10 Sri Lankan jobs inserted successfully!");

    // disconnect
    mongoose.connection.close();
    console.log("MongoDB Disconnected");

    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();