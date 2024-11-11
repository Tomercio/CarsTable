"use client";

import { useEffect, useState } from "react";
import { fetchCarData, checkDisabledParkingPermit } from "../utils/api";
import { Car } from "../types";

interface ClientSearchAndPaginationProps {
  initialCars: Car[];
}

export default function ClientSearchAndPagination({
  initialCars,
}: ClientSearchAndPaginationProps) {
  const [allCars, setAllCars] = useState<Car[]>(initialCars);
  const [displayedCars, setDisplayedCars] = useState<Car[]>(
    initialCars.slice(0, 10)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyDisabledPermit, setOnlyDisabledPermit] = useState<boolean | null>(
    null
  );
  const [totalPages, setTotalPages] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cars = await fetchCarData("", 100);
        setAllCars(cars);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const filterCars = async () => {
      let filteredCars = allCars;

      if (searchQuery.trim() !== "") {
        filteredCars = allCars.filter((car) =>
          car.mispar_rechev.toString().includes(searchQuery)
        );
      }

      if (onlyDisabledPermit !== null) {
        filteredCars = await Promise.all(
          filteredCars.map(async (car) => {
            const hasPermit = await checkDisabledParkingPermit(
              car.mispar_rechev.toString()
            );
            return { ...car, hasDisabledParkingPermit: hasPermit };
          })
        ).then((cars) =>
          cars.filter(
            (car) => car.hasDisabledParkingPermit === onlyDisabledPermit
          )
        );
      }

      const calculatedTotalPages = Math.ceil(filteredCars.length / carsPerPage);
      setTotalPages(calculatedTotalPages || 1);

      setCurrentPage(1);
      setDisplayedCars(filteredCars.slice(0, carsPerPage));
    };

    filterCars();
  }, [searchQuery, onlyDisabledPermit, allCars]);

  useEffect(() => {
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    setDisplayedCars(allCars.slice(indexOfFirstCar, indexOfLastCar));
  }, [currentPage, allCars, carsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOnlyDisabledPermit(
      value === "true" ? true : value === "false" ? false : null
    );
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Bar and Filter */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by car number"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 text-gray-900 rounded w-full"
        />

        {/* Filter for Disabled Parking Permit */}
        <select
          onChange={handleFilterChange}
          className="ml-2 px-4 py-2 bg-gray-800 text-white rounded"
        >
          <option value="">All Cars</option>
          <option value="true">Disabled Parking Permit Only</option>
          <option value="false">No Disabled Parking Permit</option>
        </select>
      </div>

      {/* Car List Table */}
      <table className="min-w-full bg-gray-700 text-white rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gray-600 text-gray-200 uppercase text-sm">
            <th className="px-6 py-3">Car Number</th>
            <th className="px-6 py-3">Manufacturer</th>
            <th className="px-6 py-3">Model</th>
            <th className="px-6 py-3">Disabled Parking Permit</th>
          </tr>
        </thead>
        <tbody>
          {displayedCars.map((car) => (
            <tr
              key={car.mispar_rechev}
              className="even:bg-gray-800 odd:bg-gray-700"
            >
              <td className=" border border-gray-300 py-4 text-center">
                <a
                  href={`/car/${car.mispar_rechev}`}
                  className="text-blue-500 hover:underline"
                >
                  {car.mispar_rechev}
                </a>
              </td>
              <td className="border border-gray-300 px-6 py-4 text-center">
                {car.tozeret_nm}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-center">
                {car.degem_nm}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-center">
                {car.hasDisabledParkingPermit ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded bg-gray-800 text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded bg-gray-800 text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
