
# Client – Task Management Frontend

---

This is the **React.js frontend** for a full-featured team and task management application built with role-based access for team leaders and members. The UI is designed with responsiveness, modularity, and usability in mind. This client connects to an API backend and supports real-time updates, authentication, and advanced state management.

---

## Features

- Beautiful & Elegant UI using MUI Components.
- Role-based views: Separate dashboards for Leaders and Members.
- Auth system: Secure login and signup with protected routes.
- Task management: Create, assign, and update tasks.
- Member management: Leaders can add/remove team members.
- Activity logs: Real-time event tracking.
- UI Modals & Dialogs: Reusable modals for creating/deleting tasks and members.
- Responsive landing page: Includes hero, features, testimonials, and CTA sections.
- State management: Built with Zustand for modular stores.
- Aotomatic Refresh on every small operation Performed
- API abstraction: Centralized Axios instance for making API calls.
- Modern stack: React + Vite + Zustand + MaterialUI.
- Sidebar on the right side displaying time, date and a small intro of the project.
- Sidebar on the left side provides easy navigation and is role-dependent.

---

## Folder Structure

```
client/
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── index.html                # App root
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite configuration
├── src/
│   ├── main.jsx              # React root render
│   ├── App.jsx               # Main app wrapper
│   ├── App.css               # Global styles
│   ├── index.css             # Tailwind base styles
│   ├── assets/               # Images and static assets
│   ├── components/
│   │   ├── common/           # Shared layout: sidebars, layout. protected-routes
│   │   ├── landing/          # Landing page UI blocks
│   │   ├── leader/           # Components specific to leader role
│   │   └── member/           # Components specific to member role
│   ├── pages/
│   │   ├── Auth/             # Login and Signup pages
│   │   ├── Leader/           # Leader dashboard, tasks, members, logs
│   │   └── Member/           # Member dashboard and tasks
│   ├── services/
│   │   └── api.js            # Central API handler (Axios instance)
│   └── store/                # Zustand state management stores
│       ├── authStore.js
│       ├── leaderStore.js
│       ├── taskStore.js
│       ├── dashboardStore.js
│       └── activityStore.js
```

---


## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Create a `.env` file in the root with necessary environment variables (like API base URL):
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

---

## Key Components

### 1. Authentication
- `Login.jsx` and `Signup.jsx`: User login and registration.
- `ProtectedRoute.jsx`: HOC to guard private routes.

### 2. Leader Pages
- `Dashboard.jsx`: Overview of members and tasks.
- `Tasks.jsx`: Task creation, editing, and deletion.
- `Members.jsx`: Manage team members.
- `ActivityLog.jsx`: View logs of user actions.

### 3. Member Pages
- `MyTasks.jsx`: Assigned tasks with status and filters.
- `PerformanceOverview.jsx`: Personal metrics and task progress.

### 4. Shared UI
- `Layout.jsx`: Wraps the app with sidebars.
- `LeftSidebar.jsx`, `RightSidebar.jsx`: Role-aware navigations.
- Modals & Dialogs: Reusable UI components for interactions.

## State Management

- Zustand is used to manage state across:
  - `authStore`: Auth & user state
  - `taskStore`: Task-related state
  - `leaderStore`: Members and leader-specific state
  - `dashboardStore`: Shared dashboard stats
  - `activityStore`: Logs and actions

## API Integration

- `services/api.js`: Centralized Axios instance handles:
  - Request headers (auth tokens)
  - Base URL from `.env`
  - API error handling

## Styling

- Uses Tailwind CSS for utility-first styling.
- Global styles in `App.css` and `index.css`.
- Responsive design for both desktop and mobile views.

---


## License

This project is licensed under the MIT License.
