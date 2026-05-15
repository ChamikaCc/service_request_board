import express from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// public routes
router.get("/",       getAllJobs);
router.get("/:id",    getJobById);

// protected routes (login required)
router.post("/",      protect, createJob);
router.patch("/:id",  protect, updateJobStatus);
router.delete("/:id", protect, deleteJob);

export default router;