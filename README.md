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

## Deployment

### Frontend (GitHub Pages)

1. In `frontend/package.json` the `homepage` field is set to your GitHub Pages URL.
2. Install the `gh-pages` package as a dev dependency:

   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. Deploy with:

   ```bash
   npm run deploy
   ```

   This builds the app and pushes the `dist` folder to the `gh-pages` branch. The site will be available at the URL above.

   > During build the client reads `VITE_API_URL` from the environment. Set this variable to your backend API URL (e.g. `https://todo-api.example.com/api/todos`) before running `npm run deploy`.

### Backend

The Node/Express API must run on a server. You can deploy it using a platform like Heroku, Railway, Vercel, or any VPS. Steps generally include:

1. Publish the `backend` folder to the host (GitHub, GitLab, etc.).
2. Configure environment variables: `PORT` and your MongoDB connection string (`MONGO_URI`).
3. Deploy and note the public URL (e.g. `https://todo-api.herokuapp.com`).

Update the frontend with this URL via `VITE_API_URL` and redeploy the frontend.

## Environment Variables

- `VITE_API_URL` — base URL for the todos API (must include `/api/todos`).
- `PORT` — backend port (defaults to 3000).
- `MONGO_URI` — connection string for MongoDB.

These should be set on your hosting platform or in a `.env` file during local development.

## Contributing

Feel free to open issues or pull requests. This is a simple learning project demonstrating a MERN-style stack.

## License

MIT License
