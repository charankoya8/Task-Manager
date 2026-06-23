# Task Manager — Frontend (Vite + React)

This workspace currently contains a frontend-only Task Manager app built with React and Vite. The app uses localStorage for persistence and provides the following features:

- Add Task
- Delete Task
- Edit Task
- Complete / Undo Task
- Due Dates
- Statistics Dashboard (Total, Completed, Pending)
- Filters (All / Completed / Pending)
- Local Storage Persistence
- Professional dark UI

## Folder Structure

client/ — React frontend (Vite)

## Quick Setup

1. Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 to view the app.

## Notes

- This repository was reverted to a frontend-only version. Any backend or API code was removed or neutralized. The app persists tasks in the browser using `localStorage`.
