# Armanish Kitchen System

Order management backend built as part of the **Codveda Technology Full-Stack Development Internship**.

## About

This project powers order management for Armanish Kitchen (Northern Nigerian native foods, Lugbe, Abuja) — menu browsing, order placement, and (in later levels) live order status updates.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT + bcrypt (Level 2)
- **Frontend:** React (Level 3)
- **Real-time:** Socket.io (Level 3)

## Level 1 — Environment Setup (this task)

- [x] Node.js and npm installed and verified
- [x] Git configured, GitHub repository created
- [x] MongoDB Atlas cluster created (or local MongoDB installed)
- [x] Project scaffolded with Express server and basic health-check route

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Samuelboman/armanish-kitchen-system.git
cd armanish-kitchen-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# then fill in your MONGO_URI

# Run the dev server
npm run dev
```

Visit `http://localhost:5000` — you should see:
```json
{ "message": "Armanish Kitchen API is running", "status": "ok" }
```

## Roadmap

- **Level 1:** Dev environment ✅ · REST API (menu CRUD) — next
- **Level 2:** Database integration (Mongoose models) · JWT authentication
- **Level 3:** React frontend (MERN) · WebSocket live order tracking

## Author

Samuel Elias Boman — [GitHub](https://github.com/Samuelboman) · [Portfolio](https://samuelboman.vercel.app)

## Internship

Built as part of the Codveda Technology internship program. #CodvedaJourney #CodvedaExperience
