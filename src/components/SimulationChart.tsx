import { useEffect, useState } from "react";
import numeral from "numeral";
import type { simulationData, chartData } from "@/lib/types";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

interface ChartProps {
  averagedSimulationData: simulationData[];
  medianSimulationData: simulationData[];
}

export default function SimulationChart({
  averagedSimulationData,
  medianSimulationData,
}: ChartProps) {
  /* ------------------------------- States ------------------------------- */

  const [title, setTitle] = useState<string>("");
  const [resultMode, setResultMode] = useState<string>("average");
  const [yearLabel, setYearLabel] = useState<string>("");
  const [portfolioLabel, setPortfolioLabel] = useState<string>("");
  const [chartData, setChartData] = useState<chartData[]>([]);
  const [xAxisTicks, setXAxisTicks] = useState<string[]>([]);

  // constants
  const chartConfig = {
    portfolioValue: {
      label: "Portfolio Value",
      color: "rgb(0 255 255)",
    },
  } satisfies ChartConfig;

  /* ------------------------------- Effects ------------------------------- */

  // when simulation data or result mode has changed,
  // determine chart properties and set it
  useEffect(() => {
    if (resultMode === "average" && averagedSimulationData.length === 0) return;
    if (resultMode === "median" && medianSimulationData.length === 0) return;

    // Process simulation data to local chart data by using year as X axis
    // Note: Use local chart data for processing because setChartData has delay
    const localSimData: simulationData[] =
      resultMode === "average" ? averagedSimulationData : medianSimulationData;
    const localChartData: chartData[] = localSimData
      .filter((x: simulationData) => Number.isInteger(x.month / 12))
      .map((x: simulationData) => ({
        year: (x.month / 12).toFixed(0),
        portfolioValue: x.portfolioValue,
      }));
    setChartData(localChartData); // just setting not using

    // Set the title
    setTitle(
      `Investment Simulation for ${
        localChartData[localChartData.length - 1].year
      } Years`
    );

    // set chart's year and portfolio label
    const lastIndex: number = localChartData.length - 1;
    const year: string = localChartData[lastIndex].year;
    const portfolio: number = localChartData[lastIndex].portfolioValue;
    setYearLabel(year);
    setPortfolioLabel(`${numeral(portfolio).format("$ 0,0")}`);

    // Set the tick years to be every 5 years
    // get the recurrence
    const recurrence: number = 5;
    let tickYear: string[] = localChartData
      .filter((_, i) => i % recurrence == 0)
      .map((x: chartData) => x.year);
    // force beginning and end
    tickYear.unshift(localChartData[0].year);
    tickYear.push(localChartData[localChartData.length - 1].year);
    // make unique
    tickYear = [...new Set(tickYear)];
    // remove the last tick if last two tick gap is 3 or less,
    // except when length is less than 3
    const firstTick: string = tickYear[0];
    const lastTick: string = tickYear[tickYear.length - 1];
    if (parseInt(lastTick) - parseInt(firstTick) > 4) {
      const secondToLastTick: string =
        tickYear[Math.max(tickYear.length - 2, 0)];
      if (parseInt(lastTick) - parseInt(secondToLastTick) < 4) {
        tickYear.pop();
      }
    }
    // set axis tick
    setXAxisTicks(tickYear);
  }, [averagedSimulationData, medianSimulationData, resultMode]);

  /* ----------------------- Event Handler Functions ----------------------- */

  // set the year and portfolio label
  const setLabelToIndex = (index: number) => {
    if (resultMode === "average" && averagedSimulationData.length === 0) return;
    if (resultMode === "median" && medianSimulationData.length === 0) return;

    const datapoint: chartData = chartData[index];
    setYearLabel(datapoint.year);
    setPortfolioLabel(numeral(datapoint.portfolioValue).format("$ 0,0"));
  };

  /* --------------------------------- tsx --------------------------------- */

  return (
    <Card
      className="bg-gray-700/10 backdrop-blur-xl 
		border border-white/20 p-6 rounded-xl text-gray-100 w-full max-w-4xl
      transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
    >
      {/* Title */}
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-1 text-center">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Radio buttons */}
        <label className="mb-3 text-lg">Result Mode: </label>
        <div className="flex space-x-6 mx-auto mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="resultMode"
              value="average"
              checked={resultMode === "average"}
              onChange={() => setResultMode("average")}
              className="w-5 h-5 rounded-full border-2 border-cyan-400
						appearance-none checked:bg-cyan-400
						focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span>Average</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="resultMode"
              value="median"
              checked={resultMode === "median"}
              onChange={() => setResultMode("median")}
              className="w-5 h-5 rounded-full border-2 border-cyan-400
						appearance-none checked:bg-cyan-400
						focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span>Median</span>
          </label>
        </div>

        {/* Year and Portfolio Value Label */}
        <div className="mb-1 text-xl text-[rgb(0,255,255)] text-center">
          Year: {yearLabel}
        </div>
        <div className="mb-1 text-xl text-[rgb(0,255,255)] text-center">
          Portfolio: {portfolioLabel}
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            onMouseMove={(state) => {
              setLabelToIndex(state.activeTooltipIndex ?? chartData.length - 1);
            }}
            onMouseLeave={() => {
              setLabelToIndex(chartData.length - 1);
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={xAxisTicks}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
              formatter={(value: number) => `${numeral(value).format("$ 0,0")}`}
            />
            <Line
              dataKey="portfolioValue"
              type="monotone"
              stroke={chartConfig.portfolioValue.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
