FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate || echo "no prisma"

RUN npm run build || true

EXPOSE 3000

CMD ["npm", "start"]
