import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { simulationData, stockPricePoint } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Reads snp500 data from SNP500.csv and return the result.
export async function readSnpData(): Promise<stockPricePoint[]> {
  try {
    const response = await fetch("/src/assets/data/SNP500.csv");
    const rawData: string = await response.text();

    const data: stockPricePoint[] = rawData.split("\r\n").map((x) => {
      const [date, price] = x.split(",");
      return { date: date, price: parseFloat(price) };
    });

    return data;
  } catch (err) {
    console.error(`Error Reading SNP CSV: ${err}`);
    return [];
  }
}

// Perform 10,000 simulations from randomly sampled monthly returns, based
// on parameters, then return the result.
export async function simulate(
  snpData: stockPricePoint[],
  principal: number,
  monthlyContribution: number,
  durationMonths: number
): Promise<simulationData[][]> {
  const N = 10000;
  const allSimulationData: simulationData[][] = [];

  // Calculate log(monthly returns) to sample from
  const monthlyReturns: number[] = [];
  for (let i = 1; i < snpData.length; ++i) {
    monthlyReturns.push(Math.log(snpData[i].price / snpData[i - 1].price));
  }

  // Simulate N number of times
  for (let n = 0; n < N; ++n) {
    // initialize first simulation data
    let currentSimulation: simulationData[] = [
      { month: 0, portfolioValue: principal },
    ];

    // Simulate through all months
    for (let i = 0; i < durationMonths; ++i) {
      // Generate current data
      const latestSim: simulationData =
        currentSimulation[currentSimulation.length - 1];
      const month: number = latestSim.month + 1;
      let currentBalance: number = latestSim.portfolioValue;

      // randomly select sample return
      const randIndex: number = Math.floor(
        Math.random() * monthlyReturns.length
      );
      const returnRate: number = Math.exp(monthlyReturns[randIndex]);

      // multiply balance by return rate, then add monthly addition
      currentBalance = currentBalance * returnRate + monthlyContribution;

      // append new simulation data
      currentSimulation.push({
        month: month,
        portfolioValue: currentBalance,
      });
    }

    allSimulationData.push(currentSimulation);
  }

  return allSimulationData;
}

// Extract the final portfolio value from 10,000 simulations, then return it.
// Note: for histogram purposes.
export async function getFinalPortfolioDist(
  allSimulationData: simulationData[][]
): Promise<number[]> {
  return allSimulationData.map(
    (x: simulationData[]) => x[x.length - 1].portfolioValue
  );
}

// Simplify the 10,000 simulation by averaging portfolio for each month.
// Note: for charting purposes.
export async function getSimulationAverage(
  allSimulationData: simulationData[][]
): Promise<simulationData[]> {
  const averagedSimulationData: simulationData[] = [];

  for (let month = 0; month < allSimulationData[0].length; ++month) {
    // Group all simulation data by current month
    const currentMonthPortfolio: number[] = allSimulationData.map(
      (x) => x[month].portfolioValue
    );

    // calculate average for current month
    const averagePortfolioValue: number =
      currentMonthPortfolio.reduce((acc, x) => acc + x, 0) /
      currentMonthPortfolio.length;

    averagedSimulationData.push({
      month: month,
      portfolioValue: averagePortfolioValue,
    });
  }

  return averagedSimulationData;
}

// Simplify the 10,000 simulation by taking the median portfolio for each month.
// Note: for charting purposes.
export async function getSimulationMedian(
  allSimulationData: simulationData[][]
): Promise<simulationData[]> {
  const medianSimulationData: simulationData[] = [];

  for (let month = 0; month < allSimulationData[0].length; ++month) {
    // Group all simulation data by current month
    const currentMonthPortfolio: number[] = allSimulationData.map(
      (x) => x[month].portfolioValue
    );

    // calculate median for current month
    const medianPortfolioValue: number = currentMonthPortfolio.sort(
      (a, b) => a - b
    )[Math.floor(currentMonthPortfolio.length / 2)];

    medianSimulationData.push({
      month: month,
      portfolioValue: medianPortfolioValue,
    });
  }

  return medianSimulationData;
}
