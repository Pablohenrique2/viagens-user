import db from "../config/db";

export class motoristaService {
  static getAllMotorista(): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM motorista", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static getMotoristaByKm(km: number): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM motorista WHERE km <= ?",
        [km],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
}
