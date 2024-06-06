# Використовуємо офіційний образ Node.js як базовий
FROM node:14

# Створюємо робочу директорію
WORKDIR /usr/src/app

# Копіюємо package.json та package-lock.json до робочої директорії
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту коду додатку до робочої директорії
COPY . .

# Відкриваємо порт
EXPOSE 3000

# Команда для запуску додатку
CMD ["npm", "start"]
