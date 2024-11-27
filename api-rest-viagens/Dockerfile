FROM node:16

# Instalar o cliente MySQL
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Configurar o diretório de trabalho
WORKDIR /app

# Copiar arquivos para o contêiner
COPY . .

# Instalar dependências
RUN npm install

# Expor a porta da API
EXPOSE 8080

# Definir o comando de entrada
CMD ["npm", "start"]
