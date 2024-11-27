import { Router } from "express";
import { directionsController } from "../controllers/directionsController";

const router = Router();

router.get("/", directionsController.getDirectionsController);

export default router;
