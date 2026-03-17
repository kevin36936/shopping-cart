# 🛒 ShopCart

A full-stack e-commerce application — my first personal project, built while learning React, TypeScript, Node.js, and PostgreSQL.

![ShopCart Homepage](./docs/screenshot.png)

## Features

- Product listing with category filter and search
- Shopping cart with add / remove / quantity update
- Guest cart — no login required to browse and add items
- User registration and login with JWT authentication
- Cart merges automatically when a guest user logs in
- Cart persists across sessions for logged-in users
- Stripe payment integration (test mode)
- Order history and account management
- Change password from account settings

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Routing   | React Router v6                                     |
| HTTP      | axios                                               |
| Backend   | Node.js (ES Modules), Express                       |
| Database  | PostgreSQL 15 via `pg`                              |
| Auth      | JWT (`jsonwebtoken` + `bcryptjs`)                   |
| Payments  | Stripe (test mode)                                  |
| Container | Docker + Docker Compose                             |

## Running with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

1. Clone the repo:
   ```bash
   git clone https://github.com/kevin36936/shopping-cart.git
   cd shopping-cart

2. Create a .env file at the project root based on .env.example:

text
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=shopping_cart
DB_PORT=5432
DB_HOST=db
JWT_SECRET=your_long_random_secret
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
BCRYPT_SALT_ROUNDS=10
PORT=3000

3. Build and start all services:
docker-compose up --build

4. Open [http://localhost:3000](http://localhost:3000)

Migrations and seeding run automatically on startup via `start.sh`

## Project Status

- [x] Product listing with filter and search
- [x] Shopping cart (guest + authenticated)
- [x] JWT authentication (register / login)
- [x] Cart persistence and guest merge on login
- [x] Stripe payment integration (test mode)
- [x] Order history
- [x] Account management (profile, change password)
- [x] Docker setup for local development
- [ ] Cloud deployment

## Development Notes
This is my first full-stack project, built while learning React, TypeScript, Node.js, and PostgreSQL from scratch.

I used AI tools heavily throughout — for explaining concepts, generating boilerplate, suggesting patterns, and debugging. Some parts (especially styling) were adapted directly from AI suggestions without deep modification.

That said, I made all architectural decisions, integrated every piece together, and learned significantly from the process. I believe in being transparent about AI usage rather than pretending otherwise