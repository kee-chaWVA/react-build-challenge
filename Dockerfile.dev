FROM node:20

WORKDIR /app

EXPOSE 5173
ENV CHOKIDAR_USEPOLLING=true

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]