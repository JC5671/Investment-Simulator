import { useEffect, useState, useRef } from "react";
import InputForm from "@/components/InputForm";
import SimulationChart from "@/components/SimulationChart";
import ProbabilityChart from "@/components/ProbabilityChart";
import type {
  InputDataType,
  StockPricePoint,
  SimulationData,
} from "@/lib/types";
import {
  readSnpData,
  simulate,
  getFinalPortfolioDistSorted,
  getSimulationAverage,
  getSimulationMedian,
} from "@/lib/utils";

export default function SimulatorPage() {
  /* ------------------------------- States ------------------------------- */
  // raw snp data
  const [snpData, setSnpData] = useState<StockPricePoint[]>([]);
  // calculated simulation data
  const [sortedFinalPortfolioDist, setSortedFinalPortfolioDist] = useState<
    number[]
  >([]);
  const [averagedSimulationData, setAveragedSimulationData] = useState<
    SimulationData[]
  >([]);
  const [medianSimulationData, setMedianSimulationData] = useState<
    SimulationData[]
  >([]);
  // input data
  const [inputData, setInputData] = useState<InputDataType>({
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
      .then((allSimulationData: SimulationData[][]) => {
        getFinalPortfolioDistSorted(allSimulationData).then((data) =>
          setSortedFinalPortfolioDist(data)
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

      {inputData.durationMonths !== 0 && (
        <>
          {/* Simulation Chart */}
          <div ref={chartRef} className="flex justify-center mb-10">
            <SimulationChart
              medianSimulationData={medianSimulationData}
              averagedSimulationData={averagedSimulationData}
            />
          </div>

          {/* Probability Chart */}
          <div className="flex justify-center mb-10">
            <ProbabilityChart sortedDist={sortedFinalPortfolioDist} />
          </div>
        </>
      )}
    </div>
  );
}
