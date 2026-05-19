import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import JobRequest from "../models/JobRequest.js";

// connect before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

// disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// clean up jobs before each test
beforeEach(async () => {
  await JobRequest.deleteMany();
});


// clean up jobs after each test
afterEach(async () => {
  await JobRequest.deleteMany();
});


// GET /api/jobs

describe("GET /api/jobs", () => {

  test("should return 200 and empty array", async () => {
    const res = await request(app).get("/api/jobs");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBe(0);
  });

  test("should return all jobs", async () => {
    // insert sample job first
    await JobRequest.create({
      title: "Test plumbing job",
      description: "Test description",
      category: "Plumbing",
      location: "Colombo",
      contactName: "Test User",
      contactEmail: "test@gmail.com",
    });

    const res = await request(app).get("/api/jobs");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe("Test plumbing job");
  });

  test("should filter by category", async () => {
    await JobRequest.create([
      { title: "Job 1", description: "desc", category: "Plumbing",   location: "Colombo", contactName: "A", contactEmail: "a@gmail.com" },
      { title: "Job 2", description: "desc", category: "Electrical", location: "Kandy",   contactName: "B", contactEmail: "b@gmail.com" },
    ]);

    const res = await request(app).get("/api/jobs?category=Plumbing");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].category).toBe("Plumbing");
  });

  test("should filter by status", async () => {
    await JobRequest.create([
      { title: "Job 1", description: "desc", category: "Plumbing", location: "Colombo", contactName: "A", contactEmail: "a@gmail.com", status: "Open" },
      { title: "Job 2", description: "desc", category: "Plumbing", location: "Kandy",   contactName: "B", contactEmail: "b@gmail.com", status: "Closed" },
    ]);

    const res = await request(app).get("/api/jobs?status=Open");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].status).toBe("Open");
  });

  test("should search by keyword in title", async () => {
    await JobRequest.create({
      title: "Leaking water pump",
      description: "Some description",
      category: "Plumbing",
      location: "Kandy",
      contactName: "Nimal",
      contactEmail: "nimal@gmail.com",
    });

    const res = await request(app).get("/api/jobs?search=pump");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

});


// POST /api/jobs

describe("POST /api/jobs", () => {

  let token;

  // register and login before tests
  beforeAll(async () => {
    // register
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@gmail.com",
        password: "Password123",
      });

    // login and get token
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "Password123",
      });

    token = res.body.token;
  });

  test("should create a job successfully", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Fix bathroom pipe",
        description: "Pipe is leaking under sink",
        category: "Plumbing",
        location: "Colombo",
        contactName: "Kamal",
        contactEmail: "kamal@gmail.com",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Fix bathroom pipe");
    expect(res.body.data.status).toBe("Open");
  });

  test("should return 400 if title missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "No title here",
        category: "Plumbing",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Title and Description are required");
  });

  test("should return 400 if description missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "No description here",
        category: "Plumbing",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should return 401 if no token", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({
        title: "Fix bathroom pipe",
        description: "Pipe is leaking",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

});


// GET /api/jobs/:id

describe("GET /api/jobs/:id", () => {

  test("should return single job", async () => {
    const job = await JobRequest.create({
      title: "Solar panel wiring",
      description: "Need electrician for solar panels",
      category: "Electrical",
      location: "Anuradhapura",
      contactName: "Prasad",
      contactEmail: "prasad@gmail.com",
    });

    const res = await request(app).get(`/api/jobs/${job._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Solar panel wiring");
  });

  test("should return 404 if job not found", async () => {
    const res = await request(app).get("/api/jobs/664f1b2c9f1b2c3d4e5f6a7b");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Job not found");
  });

  test("should return 400 if invalid ID", async () => {
    const res = await request(app).get("/api/jobs/invalidid");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

});

// PATCH /api/jobs/:id

describe("PATCH /api/jobs/:id", () => {

  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "Password123",
      });
    token = res.body.token;
  });

  test("should update job status", async () => {
    const job = await JobRequest.create({
      title: "Broken water pump",
      description: "Need urgent fix",
      category: "Plumbing",
      location: "Kandy",
      contactName: "Nimal",
      contactEmail: "nimal@gmail.com",
    });

    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "In Progress" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("In Progress");
  });

  test("should return 400 for invalid status", async () => {
    const job = await JobRequest.create({
      title: "Broken water pump",
      description: "Need urgent fix",
      category: "Plumbing",
      location: "Kandy",
      contactName: "Nimal",
      contactEmail: "nimal@gmail.com",
    });

    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "Completed" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

});

// DELETE /api/jobs/:id

describe("DELETE /api/jobs/:id", () => {

  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "Password123",
      });
    token = res.body.token;
  });

  test("should delete a job", async () => {
    const job = await JobRequest.create({
      title: "Kitchen cupboard",
      description: "Need joiner to install cupboards",
      category: "Joinery",
      location: "Jaffna",
      contactName: "Kumaran",
      contactEmail: "kumaran@gmail.com",
    });

    const res = await request(app)
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Job deleted successfully");
  });

  test("should return 404 if job not found", async () => {
    const res = await request(app)
      .delete("/api/jobs/664f1b2c9f1b2c3d4e5f6a7b")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("should return 401 if no token", async () => {
    const res = await request(app)
      .delete("/api/jobs/664f1b2c9f1b2c3d4e5f6a7b");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

});