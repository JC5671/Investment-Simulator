import { useEffect, useState, useRef } from "react";
import InputForm from "@/components/InputForm";
import SimulationChart from "@/components/SimulationChart";
import type {
  inputDataType,
  stockPricePoint,
  simulationData,
} from "@/lib/types";
import {
  readSnpData,
  simulate,
  getFinalPortfolioDist,
  getSimulationAverage,
  getSimulationMedian,
} from "@/lib/utils";

export default function SimulatorPage() {
  /* ------------------------------- States ------------------------------- */
  // raw snp data
  const [snpData, setSnpData] = useState<stockPricePoint[]>([]);
  // calculated simulation data
  const [finalPortfolioDist, setFinalPortfolioDist] = useState<number[]>([]);
  const [averagedSimulationData, setAveragedSimulationData] = useState<
    simulationData[]
  >([]);
  const [medianSimulationData, setMedianSimulationData] = useState<
    simulationData[]
  >([]);
  // input data
  const [inputData, setInputData] = useState<inputDataType>({
    principal: 0.0,
    monthlyContribution: 0.0,
    durationMonths: 0.0,
  });
  // others
  const chartRef = useRef<HTMLDivElement>(null);

  /* ------------------------------- Effects ------------------------------- */

  // When simulator page loaded, read snp data, then calculate monthly returns
  useEffect(() => {
    readSnpData().then((data) => setSnpData(data));
  }, []);

  // If inputData is updated and valid, re calculate simulation data
  useEffect(() => {
    if (inputData.durationMonths === 0) return;

    simulate(
      snpData,
      inputData.principal,
      inputData.monthlyContribution,
      inputData.durationMonths
    )
      .then((allSimulationData: simulationData[][]) => {
        getFinalPortfolioDist(allSimulationData).then((data) =>
          setFinalPortfolioDist(data)
        );
        getSimulationAverage(allSimulationData).then((data) =>
          setAveragedSimulationData(data)
        );
        getSimulationMedian(allSimulationData).then((data) =>
          setMedianSimulationData(data)
        );
      })
      .finally(() => {
        chartRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
  }, [inputData]);

  /* --------------------------------- tsx --------------------------------- */

  return (
    <div>
      {/* Input field */}
      <div className="flex justify-center mb-10">
        <InputForm setInputData={setInputData} />
      </div>

      {/* Simulation Chart */}
      {inputData.durationMonths !== 0 && (
        <div ref={chartRef} className="flex justify-center mb-10">
          <SimulationChart
            medianSimulationData={medianSimulationData}
            averagedSimulationData={averagedSimulationData}
          />
        </div>
      )}
    </div>
  );
}
