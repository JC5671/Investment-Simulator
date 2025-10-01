import { useState, useEffect } from "react";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { HistChartData } from "@/lib/types";
import type { ChartConfig } from "@/components/ui/chart";

interface ChartProps {
  sortedDist: number[];
}

export default function ProbabilityChart({ sortedDist }: ChartProps) {
  /* ------------------------------- States ------------------------------- */

  const [chartData, setChartData] = useState<HistChartData[]>([]);
  const [inferenceSign, setInferenceSign] = useState<string>("<");
  const [inferenceValue, setInferenceValue] = useState<string>("");
  const [inferenceProbability, setInferenceProbability] = useState<string>("");

  const chartConfig = {
    frequency: {
      label: "Frequency",
      color: "rgb(100,180,255)",
    },
  } satisfies ChartConfig;

  /* ------------------------------- Effects ------------------------------- */

  useEffect(() => {
    if (sortedDist.length === 0) return;

    // Remove outliers in the portfolio dist
    const q1: number = sortedDist[Math.floor(sortedDist.length * 0.25)];
    const q3: number = sortedDist[Math.floor(sortedDist.length * 0.75)];
    const iqr: number = q3 - q1;
    const lowerBound: number = q1 - 1.5 * iqr;
    const upperBound: number = q3 + 1.5 * iqr;
    const filteredDist: number[] = sortedDist.filter(
      (x: number) => lowerBound <= x && x <= upperBound
    );

    // Process distribution into histogram bucket
    const bucket: number = 100;
    const min: number = Math.min(...filteredDist);
    const max: number = Math.max(...filteredDist);
    const gap: number = (max - min) / bucket;

    const localChartData: HistChartData[] = [];
    for (let curr = min; curr < max; curr += gap) {
      // Calculate frequency
      const count: number = filteredDist.filter(
        (x: number) => curr <= x && x <= curr + gap
      ).length;
      const frequency: number = count / filteredDist.length;

      // Generate label part: 1.24M, 1.33B, etc.
      const labelParts: string[] = numeral(curr).format("$0,0").split(",");
      const scale: string[] = ["", "K", "M", "B", "T"];
      let bucketLabel = labelParts[0];
      bucketLabel +=
        labelParts.length <= 1 ? "" : "." + labelParts[1].slice(0, 2);
      bucketLabel += scale[labelParts.length - 1];

      // Add to list of buckets
      localChartData.push({
        bucket: bucketLabel,
        frequency: frequency,
      });
    }

    setChartData(localChartData);
    setInferenceSign("<");
    setInferenceValue(calculateValueFromProbability("5", "<"));
    setInferenceProbability("5");
  }, [sortedDist]);

  /* ----------------------- Event Handler Functions ----------------------- */

  // Removes all character except digits, dot, comma. Enforce 2 decimal places.
  const cleanCurrencyInput = (value: string): string => {
    if (!value) return "";

    // Remove everything except digits, dot, and comma
    let cleaned: string = value.replace(/[^\d,]/g, "");

    return cleaned;
  };

  // Place the currency commas in the correct location.
  const placeCurrencyComma = (value: string): string => {
    if (!value) return "";

    // remove existing commas
    const stripped = value.replace(/,/g, "");

    // Convert to number
    const num = parseFloat(stripped);
    if (isNaN(num)) return "";

    // Format with commas and 2 decimal places
    return numeral(num).format("0,0");
  };

  const onlyAllowDecimal = (value: string): string => {
    if (!value) return "";

    // Remove everything except digits and dot
    let cleaned: string = value.replace(/[^\d.]/g, "");

    // Only keep the first dot
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    // Restrict to 2 decimals
    if (parts.length === 2) {
      cleaned = parts[0] + "." + parts[1].replace(",", "").slice(0, 2);
    }

    return cleaned;
  };

  const calculateProbabilityFromValue = (
    value: string,
    sign: string
  ): string => {
    const valueNum: number = parseFloat(value.replace(/,/g, ""));

    let count: number = 0;
    if (sign === ">") {
      count += sortedDist.filter((x: number) => x > valueNum).length;
    } else {
      count += sortedDist.filter((x: number) => x < valueNum).length;
    }

    const probability: number = (count / sortedDist.length) * 100;

    return probability.toFixed(2);
  };

  const calculateValueFromProbability = (
    probability: string,
    sign: string
  ): string => {
    const n: number = sortedDist.length;
    const p: number = parseFloat(probability) / 100;
    let targetIndex: number = 0;

    // upper tail of distribution
    if (sign === ">") {
      targetIndex = Math.floor(n * (1 - p));
    }
    // lower tail of distribution
    else {
      targetIndex = Math.floor(n * p);
    }

    targetIndex = Math.min(Math.max(targetIndex, 0), n - 1);

    return numeral(sortedDist[targetIndex]).format("0,0");
  };

  /* --------------------------------- tsx --------------------------------- */

  return (
    <Card
      className="
      bg-gray-900/30 backdrop-blur-2xl border border-white/20 p-6 rounded-xl
		  w-full max-w-4xl text-white
      transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(100,180,255)]"
    >
      {/* Title */}
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-1 text-center">
          Final Portfolio Distribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bucket"
              tick={{ stroke: "rgba(255,255,255,1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.7)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.7)" }}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="bg-gray-900/90 border-0" />
              }
              formatter={(value: number) =>
                `Frequency: ${(value * 100).toFixed(2)}%`
              }
            />
            <Bar
              dataKey="frequency"
              type="monotone"
              fill={chartConfig.frequency.color}
              radius={8}
            />
          </BarChart>
        </ChartContainer>

        {/* Inference Section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-x-0 gap-y-1 mb-5 mt-5">
          {/* Probability Expression */}
          <div className="flex justify-center items-center">
            <span>{"P(Portfolio"}</span>

            {/* Sign Dropdown*/}
            <select
              value={inferenceSign}
              onChange={(e) => {
                setInferenceSign(e.target.value);
                setInferenceProbability("");
              }}
              className="
              border border-gray-700 rounded-md px-1 py-0
              bg-gray-900/50 backdrop-blur-3xl text-sm
              focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
            >
              <option value=">">{">"}</option>
              <option value="<">{"<"}</option>
            </select>

            <span>$</span>

            {/* Inference value */}
            <input
              id="portfolioValue"
              type="text"
              inputMode="decimal"
              className="
              w-30 border border-gray-700 rounded-md px-1 py-0
              bg-gray-900/50 backdrop-blur-3xl placeholder-gray-400
              focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
              value={inferenceValue}
              onChange={(e) => {
                const value: string = e.target.value;
                if (value !== "" && value !== inferenceValue) {
                  setInferenceProbability("");
                }
                setInferenceValue(cleanCurrencyInput(e.target.value));
              }}
              onBlur={(e) => {
                setInferenceValue(placeCurrencyComma(e.target.value));
              }}
            />

            <span>{")"}</span>
          </div>

          {/* Probability Result*/}
          <div className="flex justify-center items-center">
            <span>{"="}</span>

            {/* Inference Probability */}
            <input
              id="probability"
              type="text"
              inputMode="decimal"
              className="
              w-16 border border-gray-700 rounded-md px-1 py-0
              bg-gray-900/50 backdrop-blur-3xl placeholder-gray-400
              focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
              value={inferenceProbability}
              onChange={(e) => {
                const probability: string = onlyAllowDecimal(e.target.value);
                if (
                  probability !== inferenceProbability &&
                  probability !== ""
                ) {
                  setInferenceValue("");
                }
                setInferenceProbability(probability);
              }}
              onBlur={(e) => {
                const probability: string =
                  parseFloat(e.target.value) > 100.0
                    ? "100.00"
                    : e.target.value;
                setInferenceProbability(probability);
              }}
            />

            <span>%</span>
          </div>
        </div>

        {/* Interpretation Section */}
        <div className="flex justify-center mb-5">
          {inferenceProbability && inferenceValue && (
            <span className="text-center">
              {`"There is a ${inferenceProbability}% probability that the portfolio's value will be ${
                inferenceSign === "<" ? "less than" : "more than"
              } $${inferenceValue}"`}
            </span>
          )}
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              if (!inferenceProbability && inferenceValue) {
                setInferenceProbability(
                  calculateProbabilityFromValue(inferenceValue, inferenceSign)
                );
              } else if (inferenceProbability && !inferenceValue) {
                setInferenceValue(
                  calculateValueFromProbability(
                    inferenceProbability,
                    inferenceSign
                  )
                );
              }
              (e.currentTarget as HTMLButtonElement).blur();
            }}
            className="
            bg-[rgb(100,180,255)] font-semibold px-4 py-2 rounded-md 
            hover:bg-[rgb(100,200,255)] active:bg-[rgb(100,180,255)]
            focus:outline-none focus:ring-2 focus:ring-[rgb(100,180,255)]
            focus:shadow-[0_0_30px_rgba(100,180,255)]"
          >
            Calculate
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
