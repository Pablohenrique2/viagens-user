import React, { useState } from "react";
import MapComponent from "./components/Mapa";
import AutocompleteInput from "./components/AutocompleteInput";
import DriversList from "./components/DriversList";
import Swal from "sweetalert2";
import InputMask from "react-input-mask";

type Location = {
  fullName: string;
  display_name: string;
  [key: string]: any;
};

const HomePage: React.FC = () => {
  const [cpf, setCpf] = useState<string>("");
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [routeTriggered, setRouteTriggered] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<any[]>([]);

  const handleRoute = () => {
    if (!origin || !destination || !cpf) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Por favor, preencha os campos de origem, destino e o CPF.",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "red",
        color: "#fff",
        customClass: {
          popup: "text-white px-6 py-4 rounded-lg text-xs",
        },
        timerProgressBar: true,
      });
      return;
    }

    if (origin.display_name === destination.display_name) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Origem e destino não podem ser iguais.",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "red",
        color: "#fff",
        customClass: {
          popup: "text-white px-6 py-4 rounded-lg text-xs",
        },
        timerProgressBar: true,
      });
      return;
    }

    setRouteTriggered(true);
  };

  const handleClearDrivers = () => {
    setDrivers([]);
  };

  const handleCpfChange = (event: any) => {
    setCpf(event.target.value);
  };

  return (
    <div className="flex flex-row gap-4 items-center p-6 bg-[#f6f6f6]">
      <MapComponent
        origin={origin}
        destination={destination}
        cpf={cpf}
        triggerRoute={routeTriggered}
        setRouteTriggered={setRouteTriggered}
        onRouteAdded={(route: any) => console.log("Rota traçada:", route)}
        setDrivers={setDrivers}
      />
      <div className="flex flex-col shadow-md p-4 bg-white rounded-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bem-vindo(a) ao RideFlow, onde suas viagens se tornam mais fáceis.
        </h1>
        <div className="w-full mb-4">
          <label className="text-gray-700 mb-1 block">CPF:</label>

          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="Digite o CPF"
            id="cpf"
            type="text"
            className="w-full px-4 py-2 bg-[#f3f3f3] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
          <div className="w-[50%]">
            <label className="text-gray-700 mb-1 block">Origem:</label>
            <AutocompleteInput
              placeholder="Digite a origem"
              onSelect={(location: Location) => {
                setOrigin(location);
              }}
            />
          </div>
          <div className="w-[50%]">
            <label className="text-gray-700 mb-1 block">Destino:</label>
            <AutocompleteInput
              placeholder="Digite o destino"
              onSelect={(location: Location) => {
                setDestination(location);
              }}
            />
          </div>
        </div>

        {drivers.length > 0 && <DriversList drivers={drivers} />}

        <div className="flex justify-center mb-4 w-full">
          {drivers.length > 0 && (
            <button
              className="mt-4 px-4 py-2 bg-[#000000] text-white font-bold rounded-md hover:bg-[#333333]"
              onClick={handleClearDrivers}
            >
              Voltar
            </button>
          )}

          {drivers.length == 0 && (
            <button
              className="mt-4 px-4 py-2 bg-[#000000] text-white font-bold rounded-md hover:bg-[#333333]"
              onClick={handleRoute}
            >
              Traçar Rota
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
