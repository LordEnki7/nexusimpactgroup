FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json /app/package-lock.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/drizzle.config.ts ./
COPY --from=base /app/shared ./shared
COPY --from=base /app/start.sh ./start.sh

RUN chmod +x start.sh

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["./start.sh"]
