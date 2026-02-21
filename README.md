# Shopping Cart

E-commerce shopping cart application built with React and Node.js.

## Prerequisites

- Node.js v18+ (with npm)
- PostgreSQL (v14 or later recommended) installed and running

## Project Structure

- `frontend/` – React application
- `backend/` – Node.js/Express API with PostgreSQL database

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd shopping-cart
2. Database Setup

Make sure PostgreSQL is running on your machine. Then create a database named shopping-cart:

bash
# Using the command line (if PostgreSQL is in your PATH)
createdb -U yourusername shopping-cart
Alternatively, use the psql interactive shell:

bash
psql -U yourusername -d postgres
Then run:

sql
CREATE DATABASE "shopping-cart";
Verify the database was created:

bash
psql -l  # or inside psql: \l
3. Backend Setup

Navigate to the backend folder and install dependencies:

bash
cd backend
npm install
Copy the example environment file and edit it with your database credentials:

bash
cp .env.example .env
Open .env and fill in the required values:

text
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=shopping-cart
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000   # Port for the backend server (optional)
Note: If you didn't set a password for PostgreSQL, you may need to leave DB_PASSWORD empty or configure PostgreSQL to trust local connections.
Now populate the database with sample products by running the seed script:

bash
npm run seed
You should see output similar to:

text
Connected to database
Table 'products' is ready.
Fetching products from API...
Fetched 20 products
Inserted 20 products
Seeding completed successfully.
If you encounter a database "shopping-cart" does not exist error, double‑check that you created the database in step 2.

Start the backend server in development mode:

bash
npm run dev
The API will be available at http://localhost:3000 (or the port you set).

4. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

bash
cd frontend
npm install
Copy the example environment file:

bash
cp .env.example .env
Edit .env to set the backend API URL (the default should work if you kept port 3000):

text
VITE_API_URL=http://localhost:3000
Start the frontend development server:

bash
npm run dev
The React app will open at http://localhost:5173 (or the port shown in the terminal).

Environment Variables

Backend (.env):
DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, PORT
Frontend (.env):
VITE_API_URL
See the .env.example files in each directory for a template.

Available Scripts

Backend

npm run dev – Start the server with nodemon for auto‑restarts.
npm start – Start the server without auto‑restart.
npm run seed – Fetch products from the Fake Store API and insert them into the database.
Frontend

npm run dev – Start the Vite development server.
npm run build – Build for production.
npm run preview – Preview the production build locally.
Troubleshooting

database "shopping-cart" does not exist – Make sure you created the database before running the seed script.
role "yourusername" does not exist – Your PostgreSQL user may not exist. Create one with createuser yourusername or use an existing user.
password authentication failed – Check your password in .env. If you never set a password, try removing the DB_PASSWORD line or setting it to an empty string.
License

MIT

text
