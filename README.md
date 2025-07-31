# Queer Pregnancy App

This repository contains a full stack web application consisting of an Express/Node backend and a React frontend. The project is intended as a capstone starter and provides features such as user authentication, pregnancy tracking and journaling.

## Setup Guide

1. Install dependencies for the server and client.
2. Add a `.env` file inside `server` and configure the variables described below.
3. Start the dev servers with `npm run start` (server) and `npm run dev` (client).
4. Seed the database with `npm run seed` if you want demo data.
5. Run tests using `npm test` from the `server` directory.


## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [PostgreSQL](https://www.postgresql.org/) running locally or an accessible database URL

## Installation

Clone the repository and install dependencies for both the server and the client:

```bash
cd server
npm install
cd ../client
npm install
```

## Environment Variables

Create a `.env` file inside the `server` directory and define the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
# Optionally override the default local connection string
# DATABASE_URL=postgres://user:password@localhost:5432/queerPregnancyApp
```

`PORT` controls which port the Express server runs on. `JWT_SECRET` and `COOKIE_SECRET` are used for authentication and should be set using environment variables rather than editing `secrets.js`.

## Development

To start the backend and frontend development servers in separate terminals:

```bash
# In the server directory
npm run start

# In the client directory
npm run dev
```

The client uses Vite and proxies API and auth requests to the backend using the `PORT` defined in the `.env` file.

### Seeding the Database

From the `server` directory, run:

```bash
npm run seed
```

This script drops existing tables, recreates them and inserts demo data defined in `server/db/seedData.js`.

## Building for Production

Run the following from the `server` directory:

```bash
npm run production:build
```

This command seeds the database and builds the React app into `client/dist`, ready to be served by Express.


