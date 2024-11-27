import { QueryInterface, Sequelize } from "sequelize"; // Importando o Sequelize
import { DataTypes } from "sequelize"; // Importando os tipos de dados do Sequelize

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    // Criando a tabela
    await queryInterface.createTable("motorista", {
      idmotorista: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      carro: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      avaliacao: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      taxa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      km: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Usando Sequelize.literal aqui
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ), // Usando Sequelize.literal aqui também
      },
    });

    // Rodando o seeder dentro da migration
    await queryInterface.bulkInsert("motorista", [
      {
        nome: "Homer Simpson",
        descricao: `Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).`,
        carro: "Plymouth Valiant 1973 rosa e enferrujado",
        avaliacao:
          "2/5 Motorista simpático,mas errou o caminho 3 vezes. O carro cheira a donuts.",
        taxa: 2.5,
        km: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: "Dominic Toretto",
        descricao: `Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.`,
        carro: "Dodge Charger R/T 1970 modificado",
        avaliacao:
          "4/5 Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
        taxa: 5.0,
        km: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: "James Bond",
        descricao: `Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.`,
        carro: "Aston Martin DB5 clássico",
        avaliacao:
          "5/5 Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
        taxa: 10.0,
        km: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    // Revertendo a criação da tabela
    await queryInterface.dropTable("motorista");
  },
};
