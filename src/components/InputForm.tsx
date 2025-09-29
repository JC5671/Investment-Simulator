import { useState } from "react";
import numeral from "numeral";
import type { inputDataType } from "@/lib/types";

interface inputProps {
  setInputData: React.Dispatch<React.SetStateAction<inputDataType>>;
}

export default function InputForm({ setInputData }: inputProps) {
  /* ------------------------------- States ------------------------------- */

  const [principal, setPrincipal] = useState<string>("");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("");
  const [durationYears, setDurationYears] = useState<string>("");

  /* ----------------------- Event Handler Functions ----------------------- */

  const cleanCurrencyInput = (value: string, allowMinus: boolean): string => {
    if (!value) return "";

    // Remove everything except digits, dot, minus, and comma
    let cleaned: string = value.replace(/[^\d.,-]/g, "");

    // Only allow a single minus at the start, if specified
    if (allowMinus) {
      const isNegative = cleaned.startsWith("-");
      cleaned = cleaned.replace(/-/g, ""); // remove all minus signs
      if (isNegative) {
        cleaned = "-" + cleaned;
      }
    }
    // strip minus if not allowNegative
    else {
      cleaned = cleaned.replace("-", "");
    }

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

  const placeCurrencyComma = (value: string): string => {
    if (!value) return "";

    // remove existing commas
    const stripped = value.replace(/,/g, "");

    // Convert to number
    const num = parseFloat(stripped);
    if (isNaN(num)) return "";

    // Format with commas and 2 decimal places
    return numeral(num).format("0,0.00");
  };

  const onlyAllowInt = (value: string): string => {
    if (!value) return "";

    return value.replace(/[^0-9]/g, "");
  };

  const checkDurationLength = (durationYears: string): boolean => {
    if (!durationYears) {
      alert("Duration cannot be empty!!!");
      return false;
    }

    if (durationYears === "0") {
      alert("Duration cannot be 0!!!");
      setDurationYears("");
      return false;
    }

    // max duration is 100 years
    if (parseInt(durationYears) > 100) {
      alert("Duration cannot be more than 100 years!!!");
      setDurationYears("");
      return false;
    }

    return true;
  };

  const setInputDataValue = () => {
    // Guard Clause: make sure duration is not more than 100 years
    if (!checkDurationLength(durationYears)) return;

    // Put 0s in the input if blank
    if (!principal) setPrincipal("0.00");
    if (!monthlyContribution) setMonthlyContribution("0.00");

    // create and set new inputData type, put 0s if blank
    const newInputData: inputDataType = {
      principal: parseFloat(principal.replace(/,/g, "")) || 0,
      monthlyContribution:
        parseFloat(monthlyContribution.replace(/,/g, "")) || 0,
      durationMonths: (parseFloat(durationYears) || 0) * 12,
    };
    setInputData(newInputData);
  };

  /* --------------------------------- tsx --------------------------------- */

  return (
    <div
      className="bg-gray-700/10 backdrop-blur-xl 
      border border-white/20 p-6 rounded-xl max-w-lg 
      mx-auto space-y-6 text-gray-100 
      transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
    >
      {/* Input Header */}
      <div className="flex justify-center">
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
      </div>

      {/* Current Principal */}
      <div className="flex flex-col">
        <label htmlFor="principalText" className="mb-1 font-medium">
          Current Principal ($)
        </label>
        <input
          id="principalText"
          type="text"
          inputMode="decimal"
          className="border border-gray-700 rounded-md px-3 py-2 bg-gray-800 text-gray-200 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={principal}
          onChange={(e) =>
            setPrincipal(cleanCurrencyInput(e.target.value, false))
          }
          onBlur={(e) => setPrincipal(placeCurrencyComma(e.target.value))}
        />
      </div>

      {/* Monthly Contribution / Withdrawal */}
      <div className="flex flex-col">
        <label htmlFor="contribution" className="mb-1 font-medium">
          Monthly Contribution / Withdrawal ($)
        </label>
        <input
          id="contribution"
          type="text"
          inputMode="decimal"
          className="border border-gray-700 rounded-md px-3 py-2 bg-gray-800 text-gray-200 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={monthlyContribution}
          onChange={(e) =>
            setMonthlyContribution(cleanCurrencyInput(e.target.value, true))
          }
          onBlur={(e) =>
            setMonthlyContribution(placeCurrencyComma(e.target.value))
          }
        />
      </div>

      {/* Duration Years */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="durationYears" className="font-medium">
          Duration (Years)
        </label>
        <input
          id="duration"
          type="text"
          inputMode="decimal"
          className="border border-gray-700 rounded-md px-3 py-2 bg-gray-800 text-gray-200 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={durationYears}
          onChange={(e) => setDurationYears(onlyAllowInt(e.target.value))}
        />
      </div>

      {/* Simulate Button */}
      <div className="flex justify-center">
        <button
          onClick={setInputDataValue}
          className="bg-cyan-600 text-white font-semibold px-4 py-2 rounded-md 
          hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-600"
        >
          Simulate
        </button>
      </div>
    </div>
  );
}
