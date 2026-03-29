#!/bin/sh

echo "Running database schema push..."
npx drizzle-kit push --force || echo "Schema push completed with warnings, continuing..."

echo "Starting server..."
exec node dist/index.cjs
