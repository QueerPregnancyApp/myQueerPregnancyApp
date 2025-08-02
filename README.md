# My Queer Pregnancy App

A full-stack web application designed to support pregnant people—especially those marginalized for their gender and sexual identities—and their partners throughout the journey of pregnancy.

## 🌈 Purpose

This app provides a space for users to track their pregnancy progress, reflect on their experience through journaling, and access relevant weekly updates tailored to their stage of pregnancy.

## 🛠️ Tech Stack

- **Frontend:** React, CSS  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Authentication:** JSON Web Tokens (JWT)  
- **Deployment:** *(coming soon)*

## ✨ Key Features

- 🔐 User authentication with JWT  
- 📖 Pregnancy journal entries  
- 📆 Week-by-week visual and content updates based on gestational stage  
- 🗂️ Organized component structure and modular Express routes  
- 🛠️ Built with accessibility and inclusivity in mind  

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

2. **Install dependencies:**

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Set up the database:**

    - Create a PostgreSQL database and update your connection string in:
      ```
      /server/db/client.js
      ```
    - Seed the database:
      ```bash
      npm run seed
      ```

4. **Run the app:**

    - In `/client`:
      ```bash
      npm run dev
      ```

    - In `/server`:
      ```bash
      npm run start:dev
      ```

5. Open the app in your browser:  
   `http://localhost:5173`

## 🤝 Contributors

- **Patsy Lin** – Full Stack Developer  
  [GitHub](https://github.com/patsylin)  
  [LinkedIn](https://linkedin.com/in/patsy-lin)

## 📬 Contact

📧 pohutchison@gmail.com

---

**Note:** This project was built as part of the Grace Hopper Program at Fullstack Academy.



