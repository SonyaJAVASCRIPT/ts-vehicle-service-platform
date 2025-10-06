FROM node:20-alpine AS builder
WORKDIR /app

# Копируем только package*.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости с флагом --legacy-peer-deps
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "run", "start"]
