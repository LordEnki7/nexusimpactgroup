#!/bin/sh
set -e

echo "Running database schema push..."
npx drizzle-kit push

echo "Starting server..."
exec node dist/index.cjs
