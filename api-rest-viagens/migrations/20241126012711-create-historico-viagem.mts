import { QueryInterface, Sequelize } from "sequelize"; // Importando o Sequelize
import { DataTypes } from "sequelize"; // Importando os tipos de dados do Sequelize

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.createTable("historicoViagem", {
      idhistoricoViagem: {
        type: DataTypes.INTEGER, // Usando DataTypes diretamente
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      origin: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      idmotorista: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.dropTable("historicoViagem");
  },
};
