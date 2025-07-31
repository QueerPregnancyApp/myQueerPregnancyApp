# Queer Pregnancy App

A full stack project that allows users to track pregnancy data and keep a personal journal. The front end is a React/Vite application and the back end is an Express API with a PostgreSQL database.

## Setup

1. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Environment variables**
   Create a `.env` file inside the `server` directory. The client dev server reads the same file. Example values:
   ```
   PORT=8080
   DATABASE_URL=postgres://localhost:5432/queerPregnancyApp
   JWT_SECRET=dev_jwt_secret
   COOKIE_SECRET=dev_cookie_secret
   ```

3. **Seed the database**
   ```bash
   cd server
   npm run seed
   ```
   This command recreates all tables and populates them using `server/db/seedData.js`.

## Running the app

Start the API server in one terminal:
```bash
cd server
npm start
```

In another terminal, run the React development server:
```bash
cd client
npm run dev
```
Requests to `/api` or `/auth` from the client are proxied to the Express server on the port defined in `.env`.

To build the client for production run `npm run build` inside `server` which runs the client build step and outputs the files to `client/dist`. You can also run `npm run production:build` in the server directory to seed the database and build everything at once.

## Usage examples

### Register a user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"password"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"password"}'
```

Both endpoints return a token stored by the client. With the server running you can explore additional routes under `/api` such as `/pregnancies`, `/weeks`, and `/journal`.
