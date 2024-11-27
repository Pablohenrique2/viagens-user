import express from "express";
import motoristaRoutes from "./routes/motoristaRoutes";
import directionsRoutes from "./routes/directionsRoutes";
import historicoViagemRouter from "./routes/historicoViagemRoutes";
import cors from "cors";

const app = express();
const port = 8080;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando opa ops opa! ele sss saassa  212112");
});

app.use("/motorista", motoristaRoutes);
app.use("/ride/estimate", directionsRoutes);
app.use("/ride/confirm", historicoViagemRouter);
app.use("/ride", historicoViagemRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
