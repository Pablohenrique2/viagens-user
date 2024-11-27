import { Router } from "express";
import { motoristaController } from "../controllers/motoristaController";

const router = Router();

router.get("/", motoristaController.getAllMotorista);

export default router;
