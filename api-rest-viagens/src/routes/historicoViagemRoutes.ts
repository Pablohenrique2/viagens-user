import { Router } from "express";
import { HistoricoViagemController } from "../controllers/historicoViagemController"; // Importe o Controller

const router = Router();

router.post("/", HistoricoViagemController.insert);
router.get("/:customer_id", HistoricoViagemController.getHistoricoViagem);

export default router;
