# Todo Project

This repository contains a full-stack Todo application split into frontend and backend directories.

## Overview

- **backend/**: A Node.js/Express REST API for managing todos with MongoDB as the database.
  - `src/models/Todo.js`: Mongoose model for todos.
  - `src/routes/todos.js`: CRUD routes for todo operations.
  - `src/db.js`: Database connection logic.
  - `server.js`: Entrypoint to start the server.

- **frontend/**: A React (Vite) application that consumes the backend API.
  - `src/App.jsx`: Main React component.
  - `src/main.jsx`: React entry point, mounting the app.
  - `vite.config.js`: Vite configuration.

## Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Start the backend server (defaults to port 3000).
2. Start the frontend development server (defaults to port 5173).
3. Use the app UI to create, read, update, and delete todos.

## Contributing

Feel free to open issues or pull requests. This is a simple learning project demonstrating a MERN-style stack.

## License

MIT License
