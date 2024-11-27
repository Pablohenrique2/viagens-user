import axios, { AxiosInstance } from "axios";

interface DirectionsResponse {
  routes: Array<{
    legs: Array<{
      distance: {
        text: string;
      };
      duration: {
        text: string;
      };
      steps: Array<{
        instructions: string;
      }>;
    }>;
  }>;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/directions/json",
  timeout: 10000,
});

export default apiClient;
