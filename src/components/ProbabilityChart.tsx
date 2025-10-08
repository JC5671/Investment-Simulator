import { useState, useEffect } from "react";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { MouseEvent } from "react";
import type { HistChartData } from "@/lib/types";
import type { ChartConfig } from "@/components/ui/chart";

interface ChartProps {
  finalDist: number[];
  finalYear: number;
}

export default function ProbabilityChart({ finalDist, finalYear }: ChartProps) {
  /* ------------------------------- States ------------------------------- */

  const [chartData, setChartData] = useState<HistChartData[]>([]);
  const [inferenceSign, setInferenceSign] = useState<string>("<=");
  const [inferenceValue, setInferenceValue] = useState<string>("");
  const [inferenceProbability, setInferenceProbability] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");

  const chartConfig = {
    frequency: {
      label: "Frequency",
      color: "rgb(100,180,255)",
    },
  } satisfies ChartConfig;

  /* ------------------------------- Effects ------------------------------- */

  // When the simulation data changes (finalDist), generate histogram.
  useEffect(() => {
    if (finalDist.length === 0) return;

    // Process distribution into histogram bucket
    const dataRange = Math.floor(
      finalDist[finalDist.length - 1] - finalDist[0]
    );
    const bucket: number = Math.min(dataRange, 100);
    const min: number = Math.floor(Math.min(...finalDist));
    const max: number = Math.floor(Math.max(...finalDist));
    const gap: number = Math.floor((max - min) / bucket);

    console.log;

    // For each bucket range
    const localChartData: HistChartData[] = [];
    for (let curr = min; curr < max; curr += gap) {
      // Calculate frequency
      const count: number = finalDist.filter(
        (x: number) => curr <= x && x <= curr + gap
      ).length;
      const frequency: number = count / finalDist.length;

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

    // Set the data
    setChartData(localChartData);

    // Preset the probability to the risk of losing all the portfolio
    setInferenceSign("<=");
    setInferenceValue("0");
    setInferenceProbability(calculateProbabilityFromValue("0", "<="));
  }, [finalDist]);

  // When the inferenceValue or inferenceProbability changes, then reinterpret.
  useEffect(() => {
    // Guard Clause: Make sure none are blank
    if (!inferenceValue || !inferenceProbability) {
      setInterpretation("");
      return;
    }

    // Determine the message
    let msg: string = `"There is a ${inferenceProbability}%`;
    msg += " chance that the final portfolio's value will be ";
    if (inferenceSign === "<=") {
      msg += inferenceValue !== "0" ? "less than" : "equal to";
    } else {
      msg += "greater than";
    }
    msg += ` ${inferenceValue}"`;

    setInterpretation(msg);
  }, [inferenceValue, inferenceProbability]);

  /* ----------------------- Event Handler Functions ----------------------- */

  // Removes all character except digits and comma. Enforce 2 decimal places.
  const cleanCurrencyInput = (value: string): string => {
    if (!value) return "";

    // Remove everything except digits and comma
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

  // Removes all character except digits and dot. Enforce 2 decimal places.
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

  // Calculates percentage of finalDist elements above or below a given value.
  const calculateProbabilityFromValue = (
    value: string,
    sign: string
  ): string => {
    const valueNum: number = parseFloat(value.replace(/,/g, ""));
    const n = finalDist.length;

    // Binary search for cutoff index
    let low = 0;
    let high = n;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (finalDist[mid] <= valueNum) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    // calculate the probability of less than or greater than
    const countLessThan: number = low;
    const probabilityLessThan: number = (countLessThan / n) * 100;
    const probability: number =
      sign === "<=" ? probabilityLessThan : 100.0 - probabilityLessThan;

    return probability.toFixed(2);
  };

  // Returns the cutoff value in finalDist for a given probability in percent.
  const calculateValueFromProbability = (
    probability: string,
    sign: string
  ): string => {
    const n: number = finalDist.length;
    const p: number = parseFloat(probability) / 100;

    // determine target index
    let targetIndex: number = 0;
    if (sign === "<=") {
      targetIndex = Math.floor(n * p) - 1; // lower tail of the distribution
    } else {
      targetIndex = Math.floor(n * (1 - p)); // upper tail of the distribution
    }

    // clamp index into range
    targetIndex = Math.min(Math.max(targetIndex, 0), n - 1);

    return numeral(finalDist[targetIndex]).format("0,0");
  };

  // When the calculate button is clicked, calculate and set either
  // the probability from value, or the value from probability.
  const handleCalculateButtonClicked = (e: MouseEvent<HTMLButtonElement>) => {
    // Remove focus from the button
    (e.currentTarget as HTMLButtonElement).blur();

    // calculate probability if that is the only thing blank
    if (!inferenceProbability && inferenceValue) {
      setInferenceProbability(
        calculateProbabilityFromValue(inferenceValue, inferenceSign)
      );
    }
    // calculate value if that is the only thing blank
    else if (inferenceProbability && !inferenceValue) {
      const value: string = calculateValueFromProbability(
        inferenceProbability,
        inferenceSign
      );

      // Calculate percent difference to make sure the probabilites are similar
      const probability: number = parseFloat(inferenceProbability);
      const recalculatedProbability: number = parseFloat(
        calculateProbabilityFromValue(value, inferenceSign)
      );
      const percentDiff: number =
        Math.abs(probability - recalculatedProbability) /
        recalculatedProbability;

      // Set the inference value
      setInferenceValue(value);
      // but set the probability to the recalculated one if percent difference
      // is greater than 5%
      if (percentDiff > 0.05)
        setInferenceProbability(recalculatedProbability.toFixed(2));
    }
  };

  /* --------------------------------- tsx --------------------------------- */

  return (
    <Card
      className="
      bg-gray-900/80 backdrop-blur-md border-0 p-6 rounded-xl
		  w-full max-w-4xl text-white
      transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(100,180,255)]"
    >
      {/* Title */}
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-1 text-center">
          Final Year {finalYear.toFixed(0)}: Portfolio Distribution
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
                if (inferenceValue && inferenceProbability)
                  setInferenceProbability("");
              }}
              className="
              bg-gray-100/30 rounded-md px-1 py-0.5 mx-1 text-sm
              focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
            >
              <option value=">=">{"≥"}</option>
              <option value="<=">{"≤"}</option>
            </select>

            <span>$</span>

            {/* Inference value */}
            <input
              id="portfolioValue"
              type="text"
              inputMode="decimal"
              className="
              w-30 rounded-md px-1 py-0 bg-gray-100/30
              focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
              value={inferenceValue}
              onChange={(e) => {
                const value: string = e.target.value;
                if (value !== "" && value !== inferenceValue)
                  setInferenceProbability("");
                setInferenceValue(cleanCurrencyInput(e.target.value));
              }}
              onBlur={(e) =>
                setInferenceValue(placeCurrencyComma(e.target.value))
              }
            />

            <span>{")"}</span>
          </div>

          {/* Inference Probability*/}
          <div className="flex justify-center items-center">
            <span>{"="}</span>

            <input
              id="probability"
              type="text"
              inputMode="decimal"
              className="
              w-16 rounded-md px-1 py-0 bg-gray-100/30
              focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
              value={inferenceProbability}
              onChange={(e) => {
                const probability: string = onlyAllowDecimal(e.target.value);
                // clear the inference value if inputted probability is valid
                if (probability !== inferenceProbability && probability !== "")
                  setInferenceValue("");
                setInferenceProbability(probability);
              }}
              onBlur={(e) => {
                // make sure the input probability is not more than 100%
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
            <span className="text-center italic">{interpretation}</span>
          )}
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCalculateButtonClicked}
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
