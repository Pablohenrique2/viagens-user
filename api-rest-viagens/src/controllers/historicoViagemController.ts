import { Request, Response } from "express";
import { historicoViagemService } from "../services/historicoViagemService"; // Importe o serviço

export class HistoricoViagemController {
  static async insert(req: Request, res: Response): Promise<void> {
    try {
      const novaInformacao = req.body;
      if (!novaInformacao.params.destination || !novaInformacao.params.origin) {
        res.status(400).json({
          message: "Os dados fornecidos no corpo da requisição são inválidos",
          error: {
            error_code: "INVALID_DATA",
            error_description:
              "verificar o preenchimento das informações não pode ter valores nulos",
          },
        });
        return;
      }
      const result = await historicoViagemService.insertInfoHistorico(
        novaInformacao
      );

      res.status(200).json({
        message: "Operação realizada com sucesso",
        sucess: {
          success: true,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Os dados fornecidos no corpo da requisição são inválidos",
        error: {
          error_code: "INVALID_DATA",
          error_description: error,
        },
      });
    }
  }

  static async getHistoricoViagem(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.customer_id) {
        res.status(400).json({
          message: "Os dados fornecidos no corpo da requisição são inválidos",
          error: {
            error_code: "INVALID_DATA",
            error_description: "customer_id não pode ser null.",
          },
        });
      }

      const customer_id = req.params.customer_id;
      const driver_id = req.query.driver_id as string | undefined;

      const historicoUser = await historicoViagemService.getHistoricoViagem(
        customer_id,
        driver_id
      );

      if (historicoUser.length === 0) {
        res.status(400).json({
          message: "Nenhum registro encontrado",
          error: {
            error_code: "INVALID_DATA",
            error_description: "Verifique as informações passadas",
          },
        });
      }

      const formattedResponse = {
        customer_id: customer_id,
        rides: historicoUser.map((item: any) => ({
          id: item.idhistoricoViagem,
          date: item.date,
          origin: item.origin,
          destination: item.destination,
          distance: item.distance,
          duration: item.duration,
          driver: {
            id: item.idmotorista,
            name: item.nome_motorista,
          },
          value: parseFloat(item.value),
        })),
      };

      res.status(200).json(formattedResponse);
    } catch (err) {
      res.status(400).json({
        message: "Os dados fornecidos no corpo da requisição são inválidos",
        error: {
          error_code: "INVALID_DATA",
          error_description: err,
        },
      });
    }
  }
}
