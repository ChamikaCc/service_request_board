import JobRequest from "../models/JobRequest.js";

// Get all jobs with optional filters
export const getAllJobs = async (req, res, next) => 
    {
  try {
    const { category, status, search } = req.query;
    const filter = {};
// if use filters
    if (category) filter.category = category;
    if (status)   filter.status = status;
//if use search term, look in title and description 
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: "i" } }, //Look at title field.Find anything that matches the word.$options: "i" :ignore uppercase/lowercase
        { description: { $regex: search, $options: "i" } },
        { location:    { $regex: search, $options: "i" } }
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// Get single job by ID
export const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      const err = new Error("Job not found");
      err.status = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// create new job
export const createJob = async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    if (!title || !description) {
      const err = new Error("Title and Description are required");
      err.status = 400;
      return next(err);
    }
// wait untill job create in db,then save
    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      user: req.user?._id,  
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// update job status
export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ["Open", "In Progress", "Closed"];
    if (!allowed.includes(status)) {
      const err = new Error(`Status must be one of: ${allowed.join(", ")}`);
      err.status = 400;
      return next(err);
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      const err = new Error("Job not found");
      err.status = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// Delete job
export const deleteJob = async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      const err = new Error("Job not found");
      err.status = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};