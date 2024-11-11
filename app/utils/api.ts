import axios from "axios";
import { Car } from "../types";

const api = axios.create({
  baseURL: "https://data.gov.il/api/3/action",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchCarData = async (query = "", limit = 100): Promise<Car[]> => {
  try {
    const response = await api.get("/datastore_search", {
      params: {
        resource_id: "053cea08-09bc-40ec-8f7a-156f0677aff3",
        q: query,
        limit: limit,
      },
    });
    console.log("Fetched car data:", response.data.result.records);
    return response.data.result.records as Car[];
  } catch (error) {
    console.error("Error fetching car data:", error);
    throw error;
  }
};

export const checkDisabledParkingPermit = async (
  carNumber: string
): Promise<boolean> => {
  try {
    const response = await api.get("/datastore_search", {
      params: {
        resource_id: "c8b9f9c8-4612-4068-934f-d4acd2e3c06e",
        q: carNumber,
      },
    });
    console.log(
      "Fetched disabled parking permit data:",
      response.data.result.records
    );

    return response.data.result.records.length > 0;
  } catch (error) {
    console.error("Error checking disabled parking permit:", error);
    return false;
  }
};

export { api };
