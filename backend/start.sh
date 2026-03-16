#!/bin/sh
echo "Waiting for DB..."
sleep 10  # Simple wait (DB needs time)

echo "Running migrate..."
npm run migrate

echo "Running seed..."
npm run seed

echo "Starting server..."
npm run start