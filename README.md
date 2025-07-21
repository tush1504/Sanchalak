
# Sanchalak – Full-Stack Role-Based Team & Task Management System

**Sanchalak** is a full-stack team & task manager application designed for teams with structured roles. It enables **Leaders** to manage members, assign tasks, view logs, and monitor team activity, while **Members** can track and update their assigned tasks. Email notifications are sent on key events, and dashboard views are role-specific.

The project includes:

- `client/` – React.js frontend with MaterialUI, role-based routing, and component-driven architecture.
- `server/` – Node.js backend using Express.js, MongoDB, JWT authentication, Nodemailer, and modular routing.

---

## Live Deployment
 - The Client side is deployed on Vercel. [Live Demo](https://sanchalak.vercel.app)
 - Note:- the Server is running on Render , and may take some time to wakeup.[Server](https://sanchalak.onrender.com)

---

## Project Structure

```

sanchalak/
├── client/                 # React frontend
│   └── README.md           # Frontend documentation
├── server/                 # Express backend
│   └── README.md           # Backend documentation
├── .gitignore
├── package.json
└── README.md               # This file

```

---

## Core Features

### Leader Capabilities
- Signup and login
- Add new members or leaders (sends credentials via email)
- Remove team members
- View all members
- Create and delete tasks
- View all tasks
- View activity logs with filters (createdBy, assignedTo, date)
- Email notification when a member completes a task
- Role-based dashboard with statistics

### Member Capabilities
- Login
- View tasks assigned to them
- Update task status
- Trigger email to leader on task completion
- Role-specific dashboard

---

## Technologies Used

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (for sending login and status emails)
- bcryptjs for password hashing
- Helmet, CORS, dotenv

### Frontend
- React.js (functional components)
- MaterialUI
- Zustand for state management
- React Router DOM (role-based routing)
- Material UI components
- Axios for API communication
- Manual refresh button on every page for updates
- Automatic refresh on every minimal changes and operation performed.

---

## Architecture Overview

Leader/Member <--> \[ React Client ] <--> \[ Express API ] <--> MongoDB

---

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sanchalak.git
cd sanchalak
````

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Start the frontend:

```bash
npm start
```

Runs at: [http://localhost:3000](http://localhost:3000)

---

##  Email Notifications

* When a leader adds a new member, credentials are emailed.
* When a member completes a task, the leader is notified by email.

---

##  Project Scripts

### Backend

| Command       | Description             |
| ------------- | ----------------------- |
| `npm run dev` | Start backend (nodemon) |
| `npm start`   | Start backend (prod)    |

### Frontend

| Command         | Description             |
| --------------- | ----------------------- |
| `npm start`     | Run React app           |
| `npm run build` | Create production build |

---


## Dashboard Controller

Two role-based endpoints:

* **Leader dashboard:** total tasks, completed/pending, total members
* **Member dashboard:** total assigned tasks, completion stats

---

## Log Filter Options

* **Created By**
* **Assigned To**
* **Date Range**

Log entries include:

* Member creation
* Task creation
* Task update
* Task deletion
* Member removal

---

## License

This project is licensed under the MIT License.

---

## Author

**Tushar Kant Sahu**
Give this project a Star if you like it. 

