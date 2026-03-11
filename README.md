# 🛒 Shopping Cart

A full-stack e-commerce shopping cart application — my first personal project, built while learning React, TypeScript, Node.js, and PostgreSQL.

## Features

- Product listing powered by [Fake Store API](https://fakestoreapi.com)
- Shopping cart with add / remove / quantity update
- Guest cart — no login required to browse and add items
- User registration and login with JWT authentication
- Cart merges automatically when a guest user logs in
- Cart persists across sessions for logged-in users

## Tech Stack

| Layer    | Technology                                 |
|----------|--------------------------------------------|
| Frontend | React, TypeScript, Tailwind CSS, shadcn/ui |
| Routing  | React Router v6                            |
| Backend  | Node.js, Express                           |
| Database | PostgreSQL                                 |
| Auth     | JWT (jsonwebtoken + bcryptjs)              |

## Prerequisites

- Node.js v18+ (with npm)
- PostgreSQL v14 or later installed and running

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kevin36936/shopping-cart.git
cd shopping-cart
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` based on `.env.example`:

```
PORT=3000
DB_USER=your_db_username
DB_HOST=localhost
DB_NAME=shopping-cart
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_long_random_secret
```

```bash
npm run migrate   # creates tables (skips already-applied migrations)
npm run seed      # seeds products, users, carts, and cart items
npm run dev       # http://localhost:3000
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev       # http://localhost:5173
```

## Project Status

- [x] Product listing
- [x] Shopping cart (guest + authenticated)
- [x] JWT authentication (register / login)
- [x] Cart persistence and guest merge on login
- [ ] Stripe payment integration (coming soon)

## 🤖 Development Notes

This is my first full-stack project, built while learning React, TypeScript,
Node.js, and PostgreSQL from scratch.

I used AI tools heavily throughout — for explaining concepts, generating boilerplate,
suggesting patterns, and debugging. Some parts (especially styling) were adapted
directly from AI suggestions without deep modification.

That said, I made all architectural decisions, integrated every piece together,
and learned significantly from the process. I believe in being transparent about
AI usage rather than pretending otherwise.
