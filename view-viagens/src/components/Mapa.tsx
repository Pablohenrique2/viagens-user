import React, { useEffect, useRef, useState } from "react";
import L, { Map, Marker, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import axios from "axios";
import Swal from "sweetalert2";

interface MapComponentProps {
  origin: { display_name: string } | null;
  destination: { display_name: string } | null;
  triggerRoute: boolean;
  cpf: string;
  setRouteTriggered: (value: boolean) => void;
  onRouteAdded: (route: any) => void;
  setDrivers: (drivers: any[]) => void;
}

interface GeocodeResult {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  options: unknown[];
  distance: number;
  duration: string;
  km: number;
  cpf: string;
}

interface Position {
  lat: number;
  lng: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  origin,
  destination,
  triggerRoute,
  setRouteTriggered,
  setDrivers,
  cpf,
}) => {
  const [drivers, setLocalDrivers] = useState<any[]>([]);
  const mapRef = useRef<Map | null>(null);
  const routingControlRef = useRef<any>(null); // RoutingControl as any
  const [carMarkers, setCarMarkers] = useState<Marker[]>([]);
  const [carPositions, setCarPositions] = useState<Position[]>([]);
  const [routeDrawn, setRouteDrawn] = useState(false);
  const [originMarker, setOriginMarker] = useState<Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<Marker | null>(
    null
  );

  const carIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/11104/11104431.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const originIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/9625/9625410.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const destinationIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/9210/9210991.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("leafletMap").setView([-15.7801, -47.9292], 4);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    if (triggerRoute && origin && destination && cpf) {
      addRoute();
      setRouteTriggered(false);
    }
  }, [triggerRoute, origin, destination, setRouteTriggered, cpf]);

  const addRoute = async () => {
    try {
      const result: GeocodeResult = await geocodeLocation();
      const originCoords = result.origin;
      const destinationCoords = result.destination;

      result.options.forEach((item: any) => {
        item.distance = result.distance;
        item.duration = result.duration;
        item.km = result.km;
        item.origin = origin;
        item.destination = destination;
        item.cpf = cpf;
      });

      if (result.options.length == 0) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title:
            "Nenhum Motorista Foi Encontrado para essa localidade, nesse momento.",
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

      setLocalDrivers(result.options);
      setDrivers(result.options);

      if (routingControlRef.current) {
        mapRef.current?.removeControl(routingControlRef.current);
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(originCoords.latitude, originCoords.longitude),
          L.latLng(destinationCoords.latitude, destinationCoords.longitude),
        ],
        routeWhileDragging: true,
        addWaypoints: false,
      }).addTo(mapRef.current!);

      const routingContainer = document.querySelector(
        ".leaflet-routing-container"
      ) as HTMLElement;
      if (routingContainer) {
        routingContainer.style.display = "none";
      }

      setRouteDrawn(true);
      addOriginAndDestinationMarkers(originCoords, destinationCoords);
      addCarMarkers(originCoords, result);
    } catch (error) {
      console.error("Erro ao traçar a rota:", error);
      alert(
        "Erro ao localizar os endereços. Verifique os nomes e tente novamente."
      );
    }
  };

  const addOriginAndDestinationMarkers = (
    originCoords: { latitude: number; longitude: number },
    destinationCoords: { latitude: number; longitude: number }
  ) => {
    if (originMarker) {
      mapRef.current?.removeLayer(originMarker);
    }
    if (destinationMarker) {
      mapRef.current?.removeLayer(destinationMarker);
    }

    const newOriginMarker = L.marker(
      [originCoords.latitude, originCoords.longitude],
      {
        icon: originIcon,
      }
    ).addTo(mapRef.current!);
    newOriginMarker.bindPopup("Origem: " + origin?.display_name);

    const newDestinationMarker = L.marker(
      [destinationCoords.latitude, destinationCoords.longitude],
      {
        icon: destinationIcon,
      }
    ).addTo(mapRef.current!);
    newDestinationMarker.bindPopup("Destino: " + destination?.display_name);

    setOriginMarker(newOriginMarker);
    setDestinationMarker(newDestinationMarker);
  };

  const addCarMarkers = (
    originCoords: { latitude: number; longitude: number },
    result: GeocodeResult
  ) => {
    const numberOfCars = result.options.length || 0;
    carMarkers.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });

    const initialCarPositions: Position[] = [];
    for (let i = 0; i < numberOfCars; i++) {
      initialCarPositions.push({
        lat: originCoords.latitude + 0.0002 * (i + 1),
        lng: originCoords.longitude + 0.0002 * (i + 1),
      });
    }

    const markers = initialCarPositions.map((position, index) => {
      const marker = L.marker([position.lat, position.lng], {
        icon: carIcon,
      }).addTo(mapRef.current!);
      marker.bindPopup(`Carro ${index + 1}`);
      return marker;
    });

    setCarMarkers(markers);
    setCarPositions(initialCarPositions);
  };

  const moveCars = () => {
    if (!routeDrawn) return;

    setCarPositions((prevPositions) =>
      prevPositions.map((car) => {
        const newLat = car.lat + (Math.random() * 0.0001 - 0.00005);
        const newLng = car.lng + (Math.random() * 0.0001 - 0.00005);
        return { ...car, lat: newLat, lng: newLng };
      })
    );
  };

  useEffect(() => {
    carMarkers.forEach((marker, index) => {
      marker.setLatLng([carPositions[index].lat, carPositions[index].lng]);
    });
  }, [carPositions, carMarkers]);

  useEffect(() => {
    const intervalId = setInterval(moveCars, 1000);
    return () => clearInterval(intervalId);
  }, [carPositions, routeDrawn]);

  const geocodeLocation = async (): Promise<GeocodeResult> => {
    const response = await axios.get("http://localhost:8080/ride/estimate", {
      params: {
        customer_id: cpf,
        origin: origin?.display_name,
        destination: destination?.display_name,
      },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`Localização não encontrada`);
    }

    return response.data;
  };

  return (
    <div className="w-full">
      <div id="leafletMap" className="h-[93vh]  rounded-md shadow-md" />
    </div>
  );
};

export default MapComponent;
