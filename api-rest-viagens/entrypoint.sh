#!/bin/bash

echo "Aguardando o banco de dados MySQL ficar pronto..."

# Aguarda o banco de dados estar pronto
while ! mysqladmin ping -h"$DB_HOST" --silent; do
  sleep 1
done

echo "Banco de dados está pronto! Rodando migrações..."

# Rodar migrações e verificar se ocorreram sem erro
echo "Rodando migrações..."
if npx sequelize db:migrate --debug; then
  echo "Migrações executadas com sucesso!"
else
  echo "Erro ao rodar as migrações!" >&2
  exit 1
fi


# Iniciar a aplicação
echo "Iniciando a aplicação..."
if npm start; then
  echo "Aplicação iniciada com sucesso!"
else
  echo "Erro ao iniciar a aplicação!" >&2
  exit 1
fi
