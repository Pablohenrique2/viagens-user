import { Sequelize, DataTypes, Dialect } from "sequelize";
import fs from "fs";
import path from "path";
import process from "process";

// Tipo para o objeto de configuração
interface Config {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  use_env_variable?: string;
}

// Variáveis
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config: Config = require(path.join(__dirname, "/../config/config.json"))[
  env
];

const db: { [key: string]: any } = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
  });
}

// Carregar modelos
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Associações
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
