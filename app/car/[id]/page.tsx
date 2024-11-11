"use client";

import { useEffect, useState } from "react";
import { fetchCarData, checkDisabledParkingPermit } from "../../utils/api";
import { Car } from "../../types";
import { useRouter, useParams } from "next/navigation";

export default function CarDetailsPage() {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [hasDisabledParkingPermit, setHasDisabledParkingPermit] = useState<
    boolean | null
  >(null);
  const [isClient, setIsClient] = useState(false);

  const params = useParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const id = params.id as string;

    if (isClient && id) {
      const fetchCarDetails = async () => {
        const allCars = await fetchCarData("", 100);
        const selectedCar = allCars.find(
          (car) => car.mispar_rechev.toString() === id
        );
        setCar(selectedCar || null);

        // Check if the car has a disabled parking permit
        const isDisabled = await checkDisabledParkingPermit(id);
        setHasDisabledParkingPermit(isDisabled);
      };
      fetchCarDetails();
    }
  }, [isClient, params.id]);

  if (car === null) return <div>Car details not found.</div>;
  if (!car) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">
          Car Details for {car.mispar_rechev}
        </h1>
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Car Number:</span>{" "}
            {car.mispar_rechev}
          </p>
          <p>
            <span className="font-semibold">Manufacturer:</span>{" "}
            {car.tozeret_nm}
          </p>
          <p>
            <span className="font-semibold">Model:</span> {car.degem_nm}
          </p>
          <p>
            <span className="font-semibold">Year:</span> {car.shnat_yitzur}
          </p>
          <p>
            <span className="font-semibold">Category:</span> {car.sug_degem}
          </p>
          <p>
            <span className="font-semibold">Engine:</span> {car.degem_manoa}
          </p>
          <p>
            <span className="font-semibold">Fuel Type:</span> {car.sug_delek_nm}
          </p>
          <p>
            <span className="font-semibold">Safety Level:</span>{" "}
            {car.ramat_eivzur_betihuty}
          </p>
          <p>
            <span className="font-semibold">Disabled Parking Permit:</span>{" "}
            {hasDisabledParkingPermit === null
              ? "Loading..."
              : hasDisabledParkingPermit
              ? "Yes"
              : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}
