# Sprintly - SaaS Project Management System

Sprintly is a full-stack MERN project management web application.  
This project was built to manage organizations, team members, projects, tasks, notifications, and reports from one system.

The main idea of this project is to help teams work in a more organized way by using one workspace-based platform instead of managing everything manually or with different tools.

---

## Project Idea

In many teams, task tracking and project communication are not properly organized.  
Sometimes members use separate tools for assigning tasks, checking progress, and communication, which makes the workflow confusing.

To solve that problem, we built Sprintly.

This system allows users to:
- create an organization
- invite members
- create projects
- assign tasks
- update task status
- collaborate with comments
- receive notifications
- view basic reports and summaries

---

## Main Features

### Authentication
- User registration
- Email verification
- Login and logout
- Forgot password / reset password
- Protected routes

### Organization Management
- Create organization/workspace
- Invite members by email
- Role-based access handling

### Project Management
- Create and manage projects
- Add project members
- Track project progress

### Task Management
- Create, update, and delete tasks
- Assign tasks to members
- Change task status
- Kanban-style task workflow
- Add task comments

### Notifications
- In-app notifications
- Activity-based updates

### Reports
- Dashboard summaries
- Basic analytics and reporting

### Profile
- Update profile
- Upload and remove profile image

---

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Recharts
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Brevo API
- Cloudinary
- Socket.IO

---

### How to Run the Project
-----------------------

**1. Clone the repository**

git clone https://github.com/jamilahamad/Spritly--SaaS-Project-Management-System.git
cd Spritly--SaaS-Project-Management-System

### Backend Setup

**2. Install backend dependencies**

cd backend
npm install

**3. Create backend .env**

Create a .env file inside the backend folder and add:
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

FRONTEND_URL=http://localhost:3000

BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email
FROM_NAME=Sprintly

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

**4. Run backend**

npm run dev

### Frontend Setup

**5. Install frontend dependencies**

Open a new terminal and run:
cd frontend
npm install

**6. Create frontend .env**

Create a .env file inside the frontend folder and add:
REACT_APP_API_URL=http://localhost:5000/api

**7. Run frontend**

npm start


### API Modules

The backend is divided into several main modules:

/api/auth
/api/organizations
/api/projects
/api/tasks
/api/comments
/api/notifications
/api/analytics


#### Deployment
Frontend: Vercel
Backend: Railway
Database: MongoDB Atlas
Email Service: Brevo API
Image Upload: Cloudinary


#### Challenges Faced

One of the biggest challenges in this project was handling email sending in deployment.

At first, SMTP worked locally, but it failed in deployment because of connection timeout issues.
Later, the email system was improved using Brevo API, which made email verification, forgot password, and invitation email handling more reliable in deployment.

Another challenge was making the organization, invitation, and task flow work together properly across both frontend and backend.


#### Known Limitations
Email features need proper Brevo API configuration
Profile image upload needs valid Cloudinary configuration
Some edge-case validation can still be improved
Some production-level security and hardening can be improved further


### Future Improvements
Improve task key generation
Improve account deletion safety
Add stronger validation for update routes
Improve auth handling in production
Add better analytics and reporting
Improve overall error handling consistency


### Why We Built This Project

We wanted to build a project that is more practical than a simple CRUD app.
Instead of building only a login system or only a task app, we tried to build a complete system where authentication, organizations, members, projects, tasks, and notifications work together.

This project helped us practice both frontend and backend integration, API handling, authentication, deployment, and real-world debugging.

### Author

Developed by **Shtabdee Paul** & **Jamil Ahamad Alamin**

### License

This project is for educational and portfolio purpose
