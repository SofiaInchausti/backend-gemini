FROM node:18-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de package para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Si utilizas TypeScript, compila el código (asegúrate de tener el script "build" en tu package.json)
RUN npx tsc

# Etapa 2: Imagen final para producción
FROM node:18-alpine

WORKDIR /app

# Copiamos únicamente los archivos necesarios para producción
COPY package*.json ./
RUN npm install --only=production

# Copiamos los archivos compilados desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Exponemos el puerto que utiliza tu aplicación (ajusta el número según tu configuración)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
