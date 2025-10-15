# 📖 Library Management System

A **full-stack web application** for managing a library's collection, built with **Python (FastAPI)** and **React**.  
This system allows users to browse and issue books, and provides a comprehensive admin panel for managing the library's inventory, viewing issue reports, and more.

---

## ✨ Features

- 🔐 **User Authentication:** Secure user login via Google OAuth 2.0
- 🧑‍💼 **Admin Authentication:** Separate, simplified login for administrative access
- 📚 **Book Management:** Admins can add new books to the library and remove existing ones
- 🔄 **Issue & Return System:** Users can issue available books and view/return their issued books on a dedicated page
- 📊 **Admin Dashboard:** A complete panel for admins to view all issued books across the library
- 📈 **Reporting:** Admins can download an Excel report of all currently issued books
- 💻 **Dynamic UI:** A responsive and interactive frontend built with React

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Backend** | FastAPI (Python) |
| **Frontend** | React (with Vite) |
| **Database** | PostgreSQL |
| **Authentication** | Google OAuth 2.0 |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

---

### 1️⃣ Prerequisites

Before you begin, ensure you have the following software installed:

- **Git:** For cloning the repository
- **Python 3.10+:** For running the backend server
- **Node.js and npm:** For running the React frontend
- **PostgreSQL:** The database for the application

📦 **Download and install** PostgreSQL from the [official website](https://www.postgresql.org/download/).  
During installation, you'll set a password for the default `postgres` user — remember it for your `.env` file.

---

### 2️⃣ Installation & Setup

#### **Step A: Clone the Repository**

```bash
git clone https://github.com/BhuvanKaul/Library-Management.git
cd library-management
```

#### **Step B: Backend Setup**

**Create and Activate a Virtual Environment:**

```bash
# Create the virtual environment
python -m venv .venv

# Activate it (Windows)
.\.venv\Scripts\activate

# Activate it (macOS/Linux)
source .venv/bin/activate
```

**Install Dependencies:**

```bash
pip install -r requirements.txt
```

#### **Step C: Frontend Setup**

```bash
# Open a new terminal
cd frontend

# Install Node dependencies
npm install
```

#### **Step D: Google OAuth 2.0 Setup**

To enable Google Login:

1. Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
2. Create a new project (if needed).
3. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**.
4. Configure the OAuth consent screen (choose **External** for User Type).
5. Choose **Web application** as the Application type.
6. Add the following under **Authorized URLs**:
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:5173/auth/callback
     ```
7. Click **Create**, and note your **Client ID** and **Client Secret**.

#### **Step E: Configure Environment Variables**

You'll need two `.env` files — one for backend and one for frontend.

**Backend `.env`:**

```ini
# Database Credentials
DB_NAME="library"
DB_USER="postgres"
DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
DB_HOST="localhost"
DB_PORT="5432"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_FROM_GOOGLE_CONSOLE"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET_FROM_GOOGLE_CONSOLE"

# JWT Secret
JWT_SECRET_KEY="a-very-long-and-super-secret-random-string"
JWT_ALGORITHM="HS256"
```

**Frontend `.env`:**

```ini
VITE_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_FROM_GOOGLE_CONSOLE"
```

⚠️ **Remember:** `VITE_` prefix is required for Vite to access environment variables.

#### **Step F: Set Up the Database**

With your backend virtual environment activated:

```bash
# Create the database and tables
python db_migrate.py

# Seed the database with sample data
python seed.py
```

---

### 3️⃣ Running the Application

Run the backend and frontend in two separate terminals.

**Start the Backend: run the command in root library-management**

```bash
uvicorn main:app --reload
```

Server runs on 👉 http://127.0.0.1:8000

**Start the Frontend:, run the command in app/frontend**

```bash
npm run dev
```

Frontend runs on 👉 http://localhost:5173
