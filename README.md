# Service Request Board

A full-stack web application that allows homeowners to post service requests and tradespeople to browse, manage, and update job statuses.

Built as part of the **Full-Stack Developer Intern Technical Assessment – GlobalTNA**.

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Other**
- JWT Authentication (Bonus)
- Jest + Supertest (Unit Testing)
- REST API Architecture

---

## Features

### Core Features
- Create a new service request
- View all job requests
- View job details
- Update job status (Open → In Progress → Closed)
- Delete a job
- Category-based filtering
- Status-based filtering

### Bonus Features Implemented
- Keyword search (title & description)
- JWT Authentication (protected actions)
- Unit tests (17 tests using Jest & Supertest)
-  Seed script (sample data)

### Not Implemented
- Deployment (Frontend to Vercel / Backend to Render or Railway)

---

## Project Structure

```
SERVICE_REQUEST_BOARD/
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   └── jobs.test.js
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── jobController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── jobRequest.js
│   │   │   └── User.js
│   │   └── routes/
│   │       ├── auth.js
│   │       └── jobs.js
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── .next/
    ├── app/
    │   ├── jobs/
    │   │   ├── [id]/
    │   │   │   └── page.tsx
    │   │   └── new/
    │   │       └── page.tsx
    │   ├── login/
    │   │   └── page.tsx
    │   ├── register/
    │   │   └── page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    └── components/
        ├── AuthLayout.jsx
        ├── JobCard.tsx
        └── navbar.tsx
```
---

##  Setup Instructions

### 1. Clone the Repository


git clone https://github.com/ChamikaCc/service_request_board.git
cd service_request_board
Backend Setup
cd backend
npm install
Create .env file in backend folder:
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run Backend
npm run dev

- Backend runs on:
 http://localhost:4000

- Frontend Setup
cd frontend
npm install
npm run dev

- Frontend runs on:
  http://localhost:3000

### API Endpoints
#### Jobs
- GET /api/jobs
- Get all jobs (supports filters)
  (?category=Plumbing
  ?status=Open
  ?search=keyword)
- GET /api/jobs/:id
- Get a single job
- POST /api/jobs
- Create a new job
- PATCH /api/jobs/:id
- Update job status
- DELETE /api/jobs/:id
- Delete a job

#### Authentication
- JWT-based authentication implemented
- Only logged-in users can:
- Post jobs
- Delete jobs

#### Testing

- Run tests from backend:

cd backend
npm test
✔ 17 tests passing
✔ API endpoints tested
✔ Validation & authentication covered

#### Seed Data

- To populate sample jobs:

node seed/seed.js
