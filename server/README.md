
# Sanchalak Backend – Role-Based Team & Task Manager API

**Sanchalak** is a role-based task management API designed to power the backend of a productivity platform for teams. It enables **Leaders** to manage members, tasks, and logs, while **Members** can view and update tasks assigned to them. Built with Node.js, Express, and MongoDB, it includes authentication, access control, email notifications and activity logging.

---

##  Folder Structure

```

server/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── authController.js     # Signup and login logic
│   ├── dashboardController.js# Dashboard data for both roles
│   ├── leaderController.js   # Member management & logs
│   └── taskController.js     # Task creation, update, deletion
├── middleware/
│   ├── authMiddleware.js     # JWT-based authentication middleware
│   ├── errorHandler.js       # Centralized error handler
│   ├── asyncHandler.js       # Centralized asyncWrapper
│   ├── not-found.js          # Centralized not-found handler
│   └── roleMiddleware.js     # Middleware to ensure role-based access
├── models/
│   ├── Log.js                # Activity logs (task/member events)
│   ├── Task.js               # Task schema
│   └── User.js               # User schema with roles
├── errors/
│   ├── bad-request.js               
│   ├── custom-api.js           
│   ├── not-found.js              
│   ├── unauthenticated.js             
│   └── index.js               
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── leaderRoutes.js
│   └── taskRoutes.js
├── utils/
│   ├── sendMail.js              # Nodemailer setup & email templates
│   ├── sendResponse.js          # Send response for auth routes.
│   ├── logActivity.js           # For making an entry in ActivityLog
│   ├── generateToken.js         # Token Generation
│   └── generatePassword.js      # Generate Password for Login
├── server.js                 # Main entry point
└── .env                      # Environment config

````

---

## Features

### 1. Authentication
- JWT-based login/signup
- Separate role logic for **Leader** and **Member**

### 2. Leader Capabilities
- Create new members and leaders
  - Automatically sends email with login credentials
- Remove members
- View all team members
- View real-time activity logs:
  - Member added
  - Task created
  - Task updated
  - Task deleted
  - Member removed
- Filter logs by:
  - Creator (`createdBy`)
  - Assigned user (`assignedTo`)
  - Date range
- Create and delete tasks

### 3. Member Capabilities
- View all assigned tasks
- Update task status
  - When marked **completed**, sends email to the leader

### 4. Dashboard APIs
- Leader and Member dashboards have different summary data

### 5. Email Notifications
- Sends credential emails on new member creation
- Sends task completion notifications

### 6. Role-Based Access Control
- Complete RBAC structure is followed.

---

## Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (Authentication)
- **Nodemailer** (Emails)
- **Helmet**, **CORS** (Security)
- **dotenv**, **http-status-codes**, **bcryptjs**

---

## Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/sanchalak-backend.git
cd sanchalak-backend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root and add:

```env
PORT=5000
MONGO_URI=mongodb+srv://<your-cluster>
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

>  Use an App Password for Gmail accounts with 2FA.

---

##  Scripts

| Command       | Description                        |
| ------------- | ---------------------------------- |
| `npm run dev` | Start server in dev mode (nodemon) |
| `npm start`   | Start server in production         |

---

## API Endpoints

### Auth

* `POST   /api/auth/signup` – Signup (Leader only)
* `POST   /api/auth/login` – Login (Leader/Member)

### Leader

* `POST   /api/leader/add-member` – Add new member or leader
* `DELETE /api/leader/remove-member/:id` – Remove member
* `GET    /api/leader/members` – List members
* `GET    /api/leader/activity-log` – View logs (filterable)
* `POST   /api/leader/task` – Create a task
* `DELETE /api/leader/task/:id` – Delete a task

### Member

* `GET    /api/task/my-tasks` – View assigned tasks
* `PATCH  /api/task/update/:id` – Update task status

### Dashboard

* `GET    /api/dashboard/leader` – Leader dashboard
* `GET    /api/dashboard/member` – Member dashboard

### Health Checks

* `GET    /healthz` – Server status
* `GET    /api/ping` – Ping the server (for wakeup)

---

##  Email Templates

* Welcome email for members with login credentials.
* Task completion alert for leaders.
* Task assigned alert for members.

---

##  Security

* Helmet for HTTP headers
* CORS enabled for frontend connection
* Passwords hashed using bcryptjs

---

##  License

This project is licensed under the [MIT License](LICENSE).




