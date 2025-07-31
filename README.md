# Queer Pregnancy App

A full-stack web application for tracking pregnancy progress with queer-inclusive resources. The client is built with React and Vite while the API is an Express server backed by PostgreSQL.

## Setup

1. **Install Dependencies**
   - Install [Node.js](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/).
   - Run `npm install` in both the `server` and `client` directories.

2. **Database Configuration**
   - Create a PostgreSQL database named `queerPregnancyApp` or set `DATABASE_URL` to a custom connection string.
   - Inside the `server` folder, create a `.env` file:

     ```env
     DATABASE_URL=postgres://localhost:5432/queerPregnancyApp
     PORT=8080
     JWT_SECRET=your_jwt_secret
     COOKIE_SECRET=your_cookie_secret
     ```

3. **Seed the Database**
   - From the `server` directory run:

     ```bash
     npm run seed
     ```

4. **Run the Application**
   - Start the API server from the `server` folder:

     ```bash
     npm start
     ```

   - In another terminal, start the React client from the `client` directory:

     ```bash
     npm run dev
     ```

   The Vite development server proxies API requests to the Express server.

## Building for Production

To build the client for production and seed the database in one step run:

```bash
cd server
npm run production:build
```

This runs the seeding script and compiles the React application to `client/dist`. You can then serve the built client with the Express server by running:

```bash
npm start
```

## Project Purpose

This project aims to create an inclusive pregnancy tracking tool with week-by-week data and journaling features geared toward the LGBTQ+ community.
