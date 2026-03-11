import { useState, useMemo } from "react";

const PROPERTY_TYPES = [
  { value: "multifamily_income", label: "Apartment Complex (Income-Eligible)", rebatePerPort: 14400, chargerType: "L2" },
  { value: "multifamily_standard", label: "Apartment Complex (Standard)", rebatePerPort: 5000, chargerType: "L2" },
  { value: "hotel", label: "Hotel / Hospitality", rebatePerPort: 7500, chargerType: "L2" },
  { value: "gas_station", label: "Gas Station / C-Store", rebatePerPort: 70000, chargerType: "DCFC" },
  { value: "workplace", label: "Workplace / Office", rebatePerPort: 2500, chargerType: "L2" },
  { value: "retail", label: "Retail / Commercial", rebatePerPort: 2500, chargerType: "L2" },
  { value: "fleet", label: "Fleet Depot", rebatePerPort: 30000, chargerType: "DCFC" },
  { value: "municipal", label: "Municipal / Government", rebatePerPort: 2500, chargerType: "L2" }
];

const UTILITIES = [
  { value: "dte", label: "DTE Energy (SE Michigan)" },
  { value: "consumers", label: "Consumers Energy (W. Michigan)" },
  { value: "xcel", label: "Xcel Energy (Colorado)" },
  { value: "blackhills", label: "Black Hills Energy (Colorado)" },
  { value: "other", label: "Other" }
];

const INSTALL_COMPLEXITY = [
  { value: "simple", label: "Simple", multiplier: 1.0 },
  { value: "moderate", label: "Moderate", multiplier: 1.6 },
  { value: "complex", label: "Complex", multiplier: 2.4 }
];

function formatCurrency(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(num);
}

function ProgressBar({ value, max, label }) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{formatCurrency(value)}</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DunamisROICalculator() {
  const [propertyType, setPropertyType] = useState("multifamily_income");
  const [utility, setUtility] = useState("dte");
  const [numPorts, setNumPorts] = useState(4);

  const results = useMemo(() => {
    const pt = PROPERTY_TYPES.find(p => p.value === propertyType);

    const hardwareCost = pt.chargerType === "DCFC" ? 45000 : 1500;
    const installCost = pt.chargerType === "DCFC" ? 25000 : 2500;

    const totalProjectCost = (hardwareCost + installCost) * numPorts;

    const utilityRebate = pt.rebatePerPort * numPorts;
    const federalCredit = (pt.chargerType === "DCFC" ? 100000 : 1000) * numPorts;

    const incentives = utilityRebate + federalCredit;

    const netCost = Math.max(totalProjectCost - incentives, 0);

    const monthlyRevenue = numPorts * 150;
    const annualRevenue = monthlyRevenue * 12;
    const fiveYearRevenue = annualRevenue * 5;

    return {
      totalProjectCost,
      incentives,
      netCost,
      monthlyRevenue,
      annualRevenue,
      fiveYearRevenue
    };
  }, [propertyType, utility, numPorts]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">DUNAMIS CHARGE</h1>
        <p className="text-green-400 text-lg">EV Charger ROI Calculator</p>
        <p className="text-gray-400">Estimate incentives, costs, and revenue</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="space-y-4">

          <div>
            <label className="block mb-1">Property Type</label>
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value)}
              className="w-full text-black p-2 rounded"
            >
              {PROPERTY_TYPES.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Utility Provider</label>
            <select
              value={utility}
              onChange={e => setUtility(e.target.value)}
              className="w-full text-black p-2 rounded"
            >
              {UTILITIES.map(u => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Number of Ports</label>
            <input
              type="range"
              min="1"
              max="20"
              value={numPorts}
              onChange={e => setNumPorts(Number(e.target.value))}
              className="w-full"
            />
            <p>{numPorts}</p>
          </div>

        </div>

        <div className="bg-gray-800 p-6 rounded">

          <h2 className="text-xl font-bold mb-4">Results</h2>

          <p>Total Project Cost: {formatCurrency(results.totalProjectCost)}</p>
          <p>Total Incentives: {formatCurrency(results.incentives)}</p>
          <p className="text-green-400 text-lg font-bold">
            Net Cost: {formatCurrency(results.netCost)}
          </p>

          <div className="mt-6">
            <ProgressBar
              value={results.monthlyRevenue}
              max={results.fiveYearRevenue}
              label="Monthly Revenue"
            />
            <ProgressBar
              value={results.annualRevenue}
              max={results.fiveYearRevenue}
              label="Annual Revenue"
            />
            <ProgressBar
              value={results.fiveYearRevenue}
              max={results.fiveYearRevenue}
              label="5 Year Revenue"
            />
          </div>

        </div>

      </div>

    </div>
  );
}



