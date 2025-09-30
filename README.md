# CodeClash: A Competitive Programming Platform

CodeClash is a full-stack web application developed as a first-year university team project. It's a platform designed for users to practice their coding skills, solve algorithmic challenges, and compete in real-time against other players.

![CodeClash Home Page](<img width="1470" height="824" alt="Screenshot 2025-09-30 at 16 08 58" src="https://github.com/user-attachments/assets/e4e8c4f0-a3a5-4b14-bc2f-fa83f9f53816" />
)

---

## Core Features

Even though some backend services are currently offline, the platform was designed with the following features:

* **User Authentication**: Secure user registration and login system built with PHP and managed with sessions.
* **Problem Arena**: A list of coding challenges for users to solve, with a dedicated page for writing and submitting code.
* **Real-Time PvP Mode**: A player-vs-player mode where users are matched to solve the same problem in real-time. This feature uses a Node.js server with WebSockets for instant communication between players.
* **Live Leaderboard**: A leaderboard to rank users based on their ELO rating or total number of wins.
* **User Profile Page**: A personal dashboard where users can view their statistics (like ELO and wins), see their solved problems, and view their earned achievements.
![CodeClash Profile Page](<img width="1470" height="824" alt="Screenshot 2025-09-30 at 16 09 38" src="https://github.com/user-attachments/assets/a411f96b-ace2-4f5d-bb5f-a9fdc0ce1227" />)

---

## Technical Architecture

This project uses a hybrid backend architecture to handle both standard web requests and real-time communication.

### **Backend**

* **Primary Web Server (PHP)**: The core application logic, including user authentication, fetching data for profiles and leaderboards, and handling code submissions, is managed by a **PHP** backend.
* **Real-Time Server (Node.js)**: To enable the live PvP feature, a lightweight **Node.js** server using the `ws` library handles WebSocket connections. This allows for instant matchmaking and communication between competing players without needing to refresh the page.
* **Database (MySQL)**: All data, including user credentials, problems, and player statistics, is stored in a **MySQL** database. The initial schema and dummy data can be found in `dummy_database.sql`.

### **Frontend**

* The frontend is built with standard **HTML, CSS, and vanilla JavaScript**.
* It uses AJAX (`fetch`) to communicate with the PHP backend to dynamically load content on pages like the profile and leaderboard.
* For the PvP mode, the frontend establishes a persistent WebSocket connection to the Node.js server to send and receive live game data.

---

## A Note on Running Locally

This project was developed as part of a university course and relies on a specific local server setup (e.g., XAMPP for Apache/MySQL/PHP) and a concurrent Node.js process. Due to the age of the project and evolving dependencies, some of the backend API endpoints may no longer function correctly without debugging.

The primary purpose of this repository is to showcase the code, architecture, and the concepts implemented.
