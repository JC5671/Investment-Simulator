import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SimulationData, StockPricePoint } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Reads snp500 data from SNP500.csv and return the result.
export async function readSnpData(): Promise<StockPricePoint[]> {
  try {
    const response = await fetch("/assets/SNP500.csv");
    const rawData: string = await response.text();

    const data: StockPricePoint[] = rawData.split("\r\n").map((x) => {
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
  snpData: StockPricePoint[],
  principal: number,
  monthlyContribution: number,
  durationMonths: number
): Promise<SimulationData[][]> {
  const N = 10000;
  const allSimulationData: SimulationData[][] = [];

  // Calculate log(monthly returns) to sample from
  const monthlyReturns: number[] = [];
  for (let i = 1; i < snpData.length; ++i) {
    monthlyReturns.push(Math.log(snpData[i].price / snpData[i - 1].price));
  }

  // Simulate N number of times
  for (let n = 0; n < N; ++n) {
    // initialize first simulation data
    let currentSimulation: SimulationData[] = [
      { month: 0, portfolioValue: principal },
    ];

    // Simulate through all months
    for (let i = 0; i < durationMonths; ++i) {
      // Generate current data
      const latestSim: SimulationData =
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

// Extract final portfolio value from 10,000 simulations, sort, then return it.
// Note: for histogram purposes.
export async function getFinalPortfolioDistSorted(
  allSimulationData: SimulationData[][]
): Promise<number[]> {
  return allSimulationData
    .map((x: SimulationData[]) => x[x.length - 1].portfolioValue)
    .sort((a, b) => a - b);
}

// Simplify the 10,000 simulation by averaging portfolio for each month.
// Note: for charting purposes.
export async function getSimulationAverage(
  allSimulationData: SimulationData[][]
): Promise<SimulationData[]> {
  const averagedSimulationData: SimulationData[] = [];

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
  allSimulationData: SimulationData[][]
): Promise<SimulationData[]> {
  const medianSimulationData: SimulationData[] = [];

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
