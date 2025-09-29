export interface stockPricePoint {
  date: string;
  price: number;
}

export interface inputDataType {
  principal: number;
  monthlyContribution: number;
  durationMonths: number;
}

export interface simulationData {
  month: number;
  portfolioValue: number;
}
