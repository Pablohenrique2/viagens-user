import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Driver {
  idmotorista: number;
  nome: string;
  carro: string;
  descricao: string;
  taxa: number;
  origin: { display_name: string } | null;
  destination: { display_name: string } | null;
  distance: number;
  duration: string;
  value: number;
  cpf: string;
}

interface DriversListProps {
  drivers: Driver[];
}

const DriversList: React.FC<{ drivers: any[] }> = ({ drivers }) => {
  const navigate = useNavigate();
  let tempCPF: string;
  const showSuccessMessage = () => {
    Swal.fire({
      icon: "success",
      title: "Viagem Confirmada!",
      text: "A viagem foi confirmada com sucesso! Você está a caminho de uma experiência incrível.",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      background: "#f0f8ff",
      iconColor: "#28a745",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/history", { state: { cpf: tempCPF } });
      }
    });
  };

  const saveViagemHistorico = async (drive: Driver) => {
    if (drive.origin && drive.destination) {
      const formattedDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      tempCPF = drive.cpf;
      const response = await axios.post("http://localhost:8080/ride/confirm", {
        params: {
          idmotorista: drive.idmotorista,
          customer_id: drive.cpf,
          origin: drive.origin.display_name,
          destination: drive.destination.display_name,
          distance: drive.distance,
          date: formattedDate,
          duration: drive.duration,
          value: Number(drive.taxa),
        },
      });

      if (!response.data || response.data.length === 0) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Não foi possivel fazer esta corrida!",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "red",
          color: "#fff",
          customClass: {
            popup: " ext-white px-6 py-4 rounded-lg text-xs",
          },
          timerProgressBar: true,
        });
        throw new Error(`Não foi possivel fazer esta corrida!`);
      }

      showSuccessMessage();
    } else {
      console.error("Origem ou destino não definidos.");
    }
  };

  return (
    <div className="drivers-list overflow-y-scroll p-2 h-[380px]">
      {drivers.map((driver) => {
        const taxa = parseFloat(driver.taxa); // Garantir que taxa seja um número válido
        return (
          <div
            key={driver.idmotorista}
            className="driver-card flex items-center justify-between p-4 bg-[#f3f3f3] shadow-md rounded-lg mb-4"
          >
            <div className="flex items-center gap-4">
              {/* Ícone do carro */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/11104/11104431.png"
                alt="Car"
                className="w-12 h-12"
              />
              <div className="driver-info">
                <h3 className="text-lg font-bold">{driver.nome}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Avaliação: </span>{" "}
                  {driver.avaliacao}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Carro: </span>
                  {driver.carro}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Descrição: </span>{" "}
                  {driver.descricao}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-xl text-green-600">
                R$ {taxa ? taxa.toFixed(2) : "N/A"}
              </p>
              <button
                onClick={() => saveViagemHistorico(driver)}
                className="mt-2 px-4 py-2 bg-[#000000] text-white rounded-full hover:bg-[#333333]"
              >
                Escolher
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DriversList;
