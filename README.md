# My Queer Pregnancy App

A full-stack web application designed to support pregnant people—especially those marginalized for their gender and sexual identities—and their partners throughout the journey of pregnancy.

## 🌈 Purpose

This app provides a space for users to track their pregnancy progress, reflect on their experience through journaling, and access relevant weekly updates tailored to their stage of pregnancy.

## 🛠️ Tech Stack

- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** _(coming soon)_

## ✨ Key Features

- 🔐 User authentication with JWT
- 📖 Pregnancy journal entries
- 📆 Week-by-week visual and content updates based on gestational stage
- 🗂️ Organized component structure and modular Express routes
- 🛠️ Built with accessibility and inclusivity in mind
- ⚖️ Know Your Rights: State-by-state legal rights information for LGBTQI+ parents, including parentage, adoption, and abortion protections, with links to official sources for verification.

## 🚀 Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/QueerPregnancyApp/myQueerPregnancyApp.git
   cd myQueerPregnancyApp
   ```

2. **Install dependencies (root + workspaces):**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Copy the server `.env.example` file to `.env`:
     ```bash
     cp server/.env.example server/.env
     ```
   - Edit `server/.env` to match your local setup:
     ```
     PORT=8080
     NODE_ENV=development
     JWT_SECRET=replace-me
     DATABASE_URL=postgres://user:password@localhost:5432/mqpa
     ```

4. **Set up the database:**

   - Create a PostgreSQL database and update your connection string in:
     ```
     /server/db/client.js
     ```
   - Seed the database:
     ```bash
     npm --prefix server run seed
     ```

5. **Run the app (root command for both client & server):**

   ```bash
   npm run dev
   ```

   This will:

   - Start the Vite dev server for the React client (`client/`) on port 5173
   - Start the Express API server (`server/`) on port 8080

   In development, the client is configured to proxy `/api` requests to the server, so you can call:

   ```js
   fetch("/api/rights/CA");
   ```

6. **Run apps separately (optional):**

   - Client only:
     ```bash
     npm run dev:client
     ```
   - Server only:
     ```bash
     npm run dev:server
     ```

7. **Open the app in your browser:**
   [http://localhost:5173](http://localhost:5173)

## 📖 Know Your Rights Feature

The **Know Your Rights** page provides state-by-state information on legal protections and restrictions that impact LGBTQI+ parents.

### How it works

- Select your U.S. state from the dropdown menu.
- The app fetches up-to-date legal information from trusted external sources (currently [lgbtmap.org](https://www.lgbtmap.org/)).
- Sources are cited directly below the results for transparency.

### Notes

- This feature uses server-side caching to reduce load times and limit repeated requests to upstream data sources.
- Information is for educational purposes and should be verified with an attorney or local advocacy group for legal decision-making.

**Example request in code:**

```js
const res = await fetch('/api/rights/CA');
const data = await res.json();
console.log(data);

## 🤝 Contributors

- **Patsy Lin** – Full Stack Developer
  [GitHub](https://github.com/patsylin)
  [LinkedIn](https://linkedin.com/in/patsy-lin)

## 📬 Contact

📧 pohutchison@gmail.com

---

**Note:** This project was built as part of the Grace Hopper Program at Fullstack Academy.
```
