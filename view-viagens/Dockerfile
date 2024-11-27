# Etapa 1: Construir a aplicação
FROM node:18 AS build

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos de dependências (package.json e package-lock.json)
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY . .

# Executar o build da aplicação
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copiar os arquivos de build gerados no estágio anterior para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80 onde o Nginx estará ouvindo
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
