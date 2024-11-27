import db from "../config/db";

export class historicoViagemService {
 
  static insertInfoHistorico(novaInformacao: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO historicoViagem (
          customer_id,
          date,
          origin,
          destination,
          distance,
          duration,
          idmotorista,
          value
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        sql,
        [
          novaInformacao.params.customer_id,
          novaInformacao.params.date,
          novaInformacao.params.origin,
          novaInformacao.params.destination,
          novaInformacao.params.distance,
          novaInformacao.params.duration,
          novaInformacao.params.idmotorista,
          novaInformacao.params.value,
        ],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static async getHistoricoViagem(
    customer_id: string,
    driver_id?: string
  ): Promise<any> {
    try {
      let query = `
        SELECT h.* , m.nome as nome_motorista  FROM historicoViagem h
        LEFT JOIN motorista m ON m.idmotorista = h.idmotorista
        WHERE h.customer_id = ?
      `;

      const queryParams = [customer_id];
      if (driver_id) {
        query += " AND h.idmotorista = ?";
        queryParams.push(driver_id.toString());
      }
      query += " order by date DESC";


      const results = await new Promise((resolve, reject) => {
        db.query(query, queryParams, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      return results;
    } catch (err) {
      throw new Error(`Erro ao buscar histórico de viagem`);
    }
  }
}
