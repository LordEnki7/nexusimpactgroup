#!/bin/sh

echo "Initializing database (dropping stale tables)..."
node init-db.js

echo "Running database schema push..."
npx drizzle-kit push --force

echo "Starting server..."
exec node dist/index.cjs
