# client/Dockerfile
# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite will read this at build time
ARG VITE_API_URL=/api
ARG VITE_SOCKET_URL=""
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VSITE_SOCKET_URL

RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# Copy the built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Use our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]