# Handi-Chic Boutique Backend

This is the backend service for the Handi-Chic Boutique application, built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js installed
- PostgreSQL installed and running

## Setup Instructions

1. **Create Database**:
   Log in to your PostgreSQL terminal and create a database:
   ```sql
   CREATE DATABASE handi_chic;
   ```

2. **Run Schema**:
   Run the SQL script provided in `schema.sql` to create the `users` table:
   ```bash
   psql -d handi_chic -f schema.sql
   ```

3. **Configure Environment**:
   Update the `.env` file with your PostgreSQL credentials:
   ```env
   PORT=5000
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=handi_chic
   JWT_SECRET=your_jwt_secret
   ```

4. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

5. **Start Server**:
   ```bash
   npm start
   ```

## API Endpoints

- **POST `/api/auth/register`**: Register a new user (`name`, `email`, `password`).
- **POST `/api/auth/login`**: Login and receive a JWT token (`email`, `password`).
