import { Request, Response } from "express";
import { motoristaService } from "../services/motoristaService";

export class motoristaController {
  static async getAllMotorista(req: Request, res: Response): Promise<void> {
    try {
      const users = await motoristaService.getAllMotorista();
      res.json(users);
    } catch (err) {
      res.status(500).send("Erro ao buscar usuários");
    }
  }
}
