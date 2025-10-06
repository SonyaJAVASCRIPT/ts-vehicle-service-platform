FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN if [ ! -f prisma/schema.prisma ]; then echo "Error: prisma/schema.prisma not found"; exit 1; fi
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
COPY package*.json ./

RUN npm install --omit=dev
EXPOSE 3002
CMD ["npm", "run", "start:prod"]
