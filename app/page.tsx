import { fetchCarData } from "./utils/api";
import ClientSearchAndPagination from "./components/ClientSearchAndPagination";
import { Car } from "./types";
import "./globals.css";

export default async function HomePage() {
  let cars: Car[] = [];

  try {
    cars = await fetchCarData();
  } catch (error) {
    console.error("Failed to fetch car data on the server:", error);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-white bg-gray-800 font-serif flex py-4 justify-center header">
        Cars in Israel
      </h1>
      <div className="min-h-screen flex items-center ustify-center bg-gray-900 text-white">
        <ClientSearchAndPagination initialCars={cars} />
      </div>
    </div>
  );
}
