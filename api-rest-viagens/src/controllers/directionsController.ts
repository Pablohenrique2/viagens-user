import { Request, Response } from "express";
import { getDirections } from "../services/directionsService";
import { motoristaService } from "../services/motoristaService";

export class directionsController {
  static async getDirectionsController(
    req: Request,
    res: Response
  ): Promise<void> {
    const { origin, destination, customer_id } = req.query;
    if (!origin || !destination || !customer_id) {
      res.status(400).json({
        message: "Os dados fornecidos no corpo da requisição são inválidos",
        error: {
          error_code: "INVALID_DATA",
          error_description:
            "Faltando parâmetros: origin, destination ou customer_id",
        },
      });
    }

    if (origin === destination) {
      res.status(400).json({
        message: "Os dados fornecidos no corpo da requisição são inválidos",
        error: {
          error_code: "INVALID_DATA",
          error_description:
            "Os endereços de origem e destino não podem ser os mesmos.",
        },
      });
    }

    try {
      type RawDirectionsResponse = any;

      const response: RawDirectionsResponse = await getDirections(
        origin as string,
        destination as string
      );

      const leg = response.routes[0].legs[0];
      const valueKm = leg.distance.value / 1000;
      const users = await motoristaService.getMotoristaByKm(valueKm);

      const formattedData = {
        origin: {
          latitude: leg.start_location.lat,
          longitude: leg.start_location.lng,
        },
        destination: {
          latitude: leg.end_location.lat,
          longitude: leg.end_location.lng,
        },
        distance: leg.distance.value,
        km: leg.distance.value / 1000,
        duration: leg.duration.text,
        options: users,
        routeResponse: response,
      };

      res.status(200).json(formattedData);
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
