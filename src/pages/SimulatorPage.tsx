import { useEffect, useState } from "react";
import numeral from "numeral";
import InputForm from "@/components/InputForm";
// import Chart from "@/components/Chart";
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
  const [snpData, setSnpData] = useState<stockPricePoint[]>([]);
  const [finalPortfolioDist, setFinalPortfolioDist] = useState<number[]>([]);
  const [averagedSimulationData, setAveragedSimulationData] = useState<
    simulationData[]
  >([]);
  const [medianSimulationData, setMedianSimulationData] = useState<
    simulationData[]
  >([]);
  const [inputData, setInputData] = useState<inputDataType>({
    principal: 0.0,
    monthlyContribution: 0.0,
    durationMonths: 0.0,
  });

  // When simulator page loaded, read snp data, then calculate monthly returns
  useEffect(() => {
    readSnpData().then((data) => setSnpData(data));
  }, []);

  // If inputData is updated and valid, re calculate investmentData
  useEffect(() => {
    if (inputData.durationMonths === 0) return;

    simulate(
      snpData,
      inputData.principal,
      inputData.monthlyContribution,
      inputData.durationMonths
    ).then((allSimulationData: simulationData[][]) => {
      getFinalPortfolioDist(allSimulationData).then((data) =>
        setFinalPortfolioDist(data)
      );
      getSimulationAverage(allSimulationData).then((data) =>
        setAveragedSimulationData(data)
      );
      getSimulationMedian(allSimulationData).then((data) =>
        setMedianSimulationData(data)
      );
    });
  }, [inputData]);

  useEffect(() => {
    if (averagedSimulationData.length === 0) return;
    if (medianSimulationData.length === 0) return;

    let str = "Average Final Portfolio: \n$ ";
    str += numeral(
      averagedSimulationData[averagedSimulationData.length - 1].portfolioValue
    ).format("0,0.00");
    str += "\n\nMedian Final Portfolio: \n$ ";
    str += numeral(
      medianSimulationData[medianSimulationData.length - 1].portfolioValue
    ).format("0,0.00");

    alert(str);
  }, [averagedSimulationData, medianSimulationData]);
  return (
    <div>
      <div className="flex items-center mx-auto justify-center mb-5">
        <InputForm setInputData={setInputData} />
      </div>
      {/* 
      <div className="w-full max-w-4xl mx-auto aspect-[16/9] hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]">
        <Chart
          chartTitle={"Investment Simulation Over 20 Years Period"}
          chartData={snpData}
        />
      </div>
	  */}
    </div>
  );
}
