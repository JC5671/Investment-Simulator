import { useState } from "react";
import numeral from "numeral";
import type { inputDataType } from "@/lib/types";

interface inputProps {
  setInputData: React.Dispatch<React.SetStateAction<inputDataType>>;
}

export default function InputForm({ setInputData }: inputProps) {
  /* ------------------------------- States ------------------------------- */

  const [principal, setPrincipal] = useState<string>("");
  const [monthlyAddition, setMonthlyAddition] = useState<string>("");
  const [additionType, setAdditionType] = useState<string>("contribution");
  const [durationYears, setDurationYears] = useState<string>("");

  /* ----------------------- Event Handler Functions ----------------------- */

  // Removes all character except digits, dot, comma. Enforce 2 decimal places.
  const cleanCurrencyInput = (value: string): string => {
    if (!value) return "";

    // Remove everything except digits, dot, and comma
    let cleaned: string = value.replace(/[^\d.,]/g, "");

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

  // Place the currency commas in the correct location.
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

  // Enforce only digits
  const onlyAllowInt = (value: string): string => {
    if (!value) return "";

    return value.replace(/[^0-9]/g, "");
  };

  // Check that duration is no more than 100 years.
  // Returns true if duration is less than 100 years, otherwise return false.
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

  // Set the inputValue state from parent, essentially return by reference.
  const setInputDataValue = () => {
    // Guard Clause: make sure duration is not more than 100 years
    if (!checkDurationLength(durationYears)) return;

    // Put 0s in the input if blank
    if (!principal) setPrincipal("0.00");
    if (!monthlyAddition) setMonthlyAddition("0.00");

    // create and set new inputData type, put 0s if blank
    const newInputData: inputDataType = {
      principal: parseFloat(principal.replace(/,/g, "")) || 0,
      monthlyContribution:
        (parseFloat(monthlyAddition.replace(/,/g, "")) || 0) *
        (additionType === "contribution" ? 1 : -1),
      durationMonths: (parseFloat(durationYears) || 0) * 12,
    };
    setInputData(newInputData);
  };

  /* --------------------------------- tsx --------------------------------- */

  return (
    <div
      className="
      bg-gray-900/30 backdrop-blur-2xl border border-white/20 p-6 rounded-xl 
      space-y-6 text-white w-full max-w-sm
      transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(100,180,255)]"
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
          className="border border-gray-700 rounded-md px-3 py-2 
          bg-gray-900/50 backdrop-blur-3xl text-white placeholder-gray-400
          focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
          value={principal}
          onChange={(e) => setPrincipal(cleanCurrencyInput(e.target.value))}
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
          className="border border-gray-700 rounded-md px-3 py-2 mb-3
          bg-gray-900/50 backdrop-blur-3xl text-white placeholder-gray-400
          focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
          value={monthlyAddition}
          onChange={(e) =>
            setMonthlyAddition(cleanCurrencyInput(e.target.value))
          }
          onBlur={(e) => setMonthlyAddition(placeCurrencyComma(e.target.value))}
        />
        {/* Radio buttons */}
        <div className="flex space-x-6 mx-auto">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="additionType"
              value="contribution"
              checked={additionType === "contribution"}
              onChange={() => setAdditionType("contribution")}
              className="w-5 h-5 rounded-full border-2 border-[rgb(100,180,255)]
                        appearance-none checked:bg-[rgb(100,180,255)]
                        focus:outline-none focus:ring-2 focus:ring-[rgb(100,180,255)] 
                        active:shadow-[0_0_30px_rgba(100,180,255)]"
            />
            <span>Contribution</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="additionType"
              value="withdrawal"
              checked={additionType === "withdrawal"}
              onChange={() => setAdditionType("withdrawal")}
              className="w-5 h-5 rounded-full border-2 border-[rgb(100,180,255)]
                        appearance-none checked:bg-[rgb(100,180,255)]
                        focus:outline-none focus:ring-2 focus:ring-[rgb(100,180,255)]
                        active:shadow-[0_0_30px_rgba(100,180,255)]"
            />
            <span>Withdrawal</span>
          </label>
        </div>
      </div>

      {/* Duration Years */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="duration" className="font-medium">
          Duration (Years)
        </label>
        <input
          id="duration"
          type="text"
          inputMode="numeric"
          className="border border-gray-700 rounded-md px-3 py-2 
          bg-gray-900/50 backdrop-blur-3xl text-white placeholder-gray-400
          focus:outline-none focus:ring-0 focus:shadow-[0_0_30px_rgba(100,180,255)]"
          value={durationYears}
          onChange={(e) => setDurationYears(onlyAllowInt(e.target.value))}
        />
      </div>

      {/* Simulate Button */}
      <div className="flex justify-center">
        <button
          onClick={setInputDataValue}
          className="bg-[rgb(100,180,255)] text-white font-semibold px-4 py-2 rounded-md 
          hover:bg-[rgb(100,200,255)] active:bg-[rgb(100,180,255)]
          focus:outline-none focus:ring-2 focus:ring-[rgb(100,180,255)]
          active:shadow-[0_0_30px_rgba(100,180,255)]"
        >
          Simulate
        </button>
      </div>
    </div>
  );
}
