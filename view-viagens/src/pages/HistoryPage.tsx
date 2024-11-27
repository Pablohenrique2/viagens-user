import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface LocationState {
  cpf: string;
}

interface Driver {
  id: number;
  nome_motorista: string;
}

interface Ride {
  id: number;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: Driver;
  value: number;
}

interface History {
  rides: Ride[];
}

const HistoryPage: React.FC = () => {
  const location = useLocation();
  const [history, setHistory] = useState<History>({ rides: [] });

  const [motoristas, setMotoristas] = useState<any[]>([]);
  const [selectedMotorista, setSelectedMotorista] = useState<string | null>(
    null
  );

  const cpf = (location.state as LocationState)?.cpf;

  const fetchHistory = async () => {
    if (cpf) {
      try {
        const response = await axios.get(`http://localhost:8080/ride/${cpf}`);
        setHistory(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico de viagens:", error);
      }
    }
  };

  const getAllMotoristas = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/motorista`);
      setMotoristas(response.data);
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
    }
  };

  const filterHistoryByMotorista = async (motoristaId: string | null) => {
    if (cpf && motoristaId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/ride/${cpf}?driver_id=${motoristaId}`
        );
        setHistory(response.data);
      } catch (error) {
        setHistory({ rides: [] });
        console.error("Erro ao buscar histórico de viagens:", error);
      }
    } else {
      fetchHistory();
    }
  };

  useEffect(() => {
    fetchHistory();
    getAllMotoristas();
  }, [cpf]);

  useEffect(() => {
    filterHistoryByMotorista(selectedMotorista);
  }, [selectedMotorista]);

  return (
    <div className="bg-[#f3f3f3] h-[100vh]">
      <div className="container mx-auto p-4 bg-[#f3f3f3] w-full">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Histórico de Viagens
        </h1>

        <div className="mb-4">
          <label
            htmlFor="motorista"
            className="block text-gray-700 font-medium mb-2"
          >
            Filtrar por Motorista:
          </label>
          <select
            id="motorista"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedMotorista || ""}
            onChange={(e) =>
              setSelectedMotorista(
                e.target.value === "" ? null : e.target.value
              )
            }
          >
            <option value="">Todos os Motoristas</option>
            {motoristas.map((motorista: any) => (
              <option key={motorista.idmotorista} value={motorista.idmotorista}>
                {motorista.nome}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-4">
          {history.rides.length === 0 ? (
            <li className="bg-white shadow-md text-center rounded-lg p-4 border border-gray-200">
              <p className="text-gray-600">
                Nenhuma viagem encontrada, Com esse Motorista.
              </p>
            </li>
          ) : (
            history.rides.map((item, index) => (
              <li
                key={index}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-600 mt-1">
                      Motorista: {item.driver.nome_motorista}
                    </p>
                    <p className="font-medium text-gray-800">
                      Origem: {item.origin}
                    </p>
                    <p className="font-medium text-gray-800">
                      Destino: {item.destination}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Distância:{" "}
                    <span className="font-semibold text-gray-800">
                      {new Intl.NumberFormat("pt-BR").format(item.distance)} km
                    </span>
                  </p>
                  <p>Duração: {item.duration}</p>
                  <p className="font-medium text-gray-800">
                    Valor:{" "}
                    <span className="text-green-500">R${item.value}</span>
                  </p>
                </div>
                <hr className="my-4 border-gray-300" />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default HistoryPage;
