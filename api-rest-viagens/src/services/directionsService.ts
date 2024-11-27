import apiRouter from "../api/apiRouter";

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

export const getDirections = async (
  origin: string,
  destination: string
): Promise<DirectionsResponse> => {
  try {
    const response = await apiRouter.get<DirectionsResponse>("", {
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter direções:", error);
    throw new Error("Erro ao buscar direções");
  }
};
