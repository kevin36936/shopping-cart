#!/bin/sh
echo "Waiting for DB..."
while ! pg_isready -h db -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; do
  sleep 1
done
echo "DB is ready"

echo "Running migrate..."
npm run migrate

echo "Running seed..."
npm run seed

echo "Starting server..."
npm run start