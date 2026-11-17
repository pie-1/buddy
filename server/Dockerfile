FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

# Cap Node's heap to 256MB — plenty for this app, prevents OOM kill
ENV NODE_OPTIONS="--max-old-space-size=256"

EXPOSE 5000

CMD ["node", "server.js"]