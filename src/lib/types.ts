export interface StockPricePoint {
  date: string;
  price: number;
}

export interface InputDataType {
  principal: number;
  monthlyContribution: number;
  durationMonths: number;
}

export interface SimulationData {
  month: number;
  portfolioValue: number;
}

export interface SimChartData {
  year: string;
  portfolioValue: number;
}

export interface HistChartData {
  bucket: string;
  frequency: number;
}
