# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/client/package.json apps/client/
COPY apps/server/package.json apps/server/
RUN npm ci
COPY apps/client apps/client
RUN npm run build -w apps/client

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080 \
    STATIC_DIR=/app/apps/client/dist
COPY package.json package-lock.json ./
COPY apps/server/package.json apps/server/
RUN npm ci --omit=dev -w apps/server --include-workspace-root=false \
    && npm cache clean --force
COPY apps/server apps/server
COPY --from=build /app/apps/client/dist apps/client/dist
USER node
EXPOSE 8080
CMD ["node", "apps/server/index.js"]
