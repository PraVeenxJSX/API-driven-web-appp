# API-Driven GitHub Repo Finder

A simple MERN stack web application that allows users to search for GitHub repositories using a keyword, fetch the data from the GitHub API, and store the results in a MongoDB database for display on a persistent dashboard.

**Live Demo Link:** [Your Live Demo URL Will Go Here]

---

## Features

- **Keyword Search:** Users can enter a keyword to search for relevant GitHub repositories.
- **API Integration:** Fetches data in real-time from the official GitHub Repositories API.
- **Persistent Storage:** Search results are saved to a MongoDB database to prevent data loss and avoid duplicate entries.
- **Dynamic Dashboard:** All saved repositories are displayed on a clean, responsive dashboard.
- **Error Handling:** User-friendly messages for search errors, API rate limits, or if no results are found.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **API Client:** Axios

## Setup and Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js installed
- A free MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/api-driven-webapp.git](https://github.com/your-username/api-driven-webapp.git)
cd api-driven-webapp
```

### 2. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend folder with your MongoDB connection string
# and a port number.
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "PORT=5001" >> .env

# Start the backend server
node server.js
```
The backend server will be running on `http://localhost:5001`.

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```
The frontend application will be available at `http://localhost:5173` (or the URL Vite provides).