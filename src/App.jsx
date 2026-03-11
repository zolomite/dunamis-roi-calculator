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
  { value: "simple", label: "Simple (short wire run, adequate panel)", multiplier: 1.0 },
  { value: "moderate", label: "Moderate (medium wire run or panel upgrade)", multiplier: 1.6 },
  { value: "complex", label: "Complex (long run, major electrical work)", multiplier: 2.4 }
];

function formatCurrency(num) {
 return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFraction}
function ProgressBar({ value, max, color = "bg-emerald-500", label }) {
 const pct = Math.min((value / max) * 100, 100);
 return (
 <div className="mb-3">
 <div className="flex justify-between text-sm mb-1">
 <span className="text-slate-300">{label}</span>
 <span className="font-semibold text-white">{formatCurrency(value)}</span>
 </div>
 <div className="w-full bg-slate-700 rounded-full h-3">
 <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ wid </div>
 </div>
 );
}
export default function DunamisROICalculator() {
 const [propertyType, setPropertyType] = useState("multifamily_income");
 const [utility, setUtility] = useState("dte");
 const [numPorts, setNumPorts] = useState(4);
 const [complexity, setComplexity] = useState("simple");
 const [monthlyCharges, setMonthlyCharges] = useState(10);
 const [pricePerKwh, setPricePerKwh] = useState(0.35);
 const [avgKwhPerSession, setAvgKwhPerSession] = useState(30);
 const results = useMemo(() => {
 const pt = PROPERTY_TYPES.find(p => p.value === propertyType);
 const cx = INSTALL_COMPLEXITY.find(c => c.value === complexity);
 const isDCFC = pt.chargerType === "DCFC";
 const baseHardwareCost = isDCFC ? 45000 : 1500;
 const baseInstallCost = isDCFC ? 25000 : 2500;
 const hardwareCostPerPort = baseHardwareCost;
 const installCostPerPort = baseInstallCost * cx.multiplier;
 const meterCost = isDCFC ? 3000 : 1200;
 const totalHardware = hardwareCostPerPort * numPorts;
 const totalInstall = installCostPerPort * numPorts;
 const totalMeter = meterCost;
 const totalProjectCost = totalHardware + totalInstall + totalMeter;
 const utilityRebatePerPort = pt.rebatePerPort;
 const totalUtilityRebate = Math.min(utilityRebatePerPort * numPorts, totalProjectCost);
 const federalCreditPerPort = isDCFC ? 100000 : 1000;
 const totalFederalCredit = Math.min(federalCreditPerPort * numPorts, totalProjectCost - t const totalIncentives = totalUtilityRebate + totalFederalCredit;
 const netCost = Math.max(totalProjectCost - totalIncentives, 0);
 const coveragePct = Math.min((totalIncentives / totalProjectCost) * 100, 100);
 const monthlyRevenuePerPort = monthlyCharges * pricePerKwh * avgKwhPerSession;
 const totalMonthlyRevenue = monthlyRevenuePerPort * numPorts;
 const annualRevenue = totalMonthlyRevenue * 12;
 const fiveYearRevenue = annualRevenue * 5;
 const monthsToROI = netCost > 0 && totalMonthlyRevenue > 0
 ? Math.ceil(netCost / totalMonthlyRevenue)
 : 0;
 const annualMaintenanceCost = isDCFC ? 2400 * numPorts : 300 * numPorts;
 const netAnnualRevenue = annualRevenue - annualMaintenanceCost;
 const netFiveYearRevenue = netAnnualRevenue * 5;
 const propertyValueIncrease = isDCFC ? 50000 * numPorts : 5000 * numPorts;
 return {
 pt, isDCFC,
 hardwareCostPerPort, installCostPerPort, meterCost,
 totalHardware, totalInstall, totalMeter, totalProjectCost,
 utilityRebatePerPort, totalUtilityRebate,
 federalCreditPerPort, totalFederalCredit,
 totalIncentives, netCost, coveragePct,
 monthlyRevenuePerPort, totalMonthlyRevenue, annualRevenue, fiveYearRevenue,
 monthsToROI, annualMaintenanceCost, netAnnualRevenue, netFiveYearRevenue,
 propertyValueIncrease,
 };
 }, [propertyType, utility, numPorts, complexity, monthlyCharges, pricePerKwh, avgKwhPerSess return (
 <div className="min-h-screen bg-slate-900 text-white">
 <div className="max-w-6xl mx-auto p-4">
 {/* Header */}
 <div className="text-center mb-8 pt-4">
 <h1 className="text-3xl font-bold text-white tracking-tight">DUNAMIS CHARGE</h1>
 <p className="text-lg text-emerald-400 font-semibold mt-1">EV Charger ROI Calculato <p className="text-sm text-slate-400 mt-2">See how much you save with utility rebat </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* LEFT: Inputs */}
 <div className="space-y-4">
 <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
 <h2 className="text-lg font-bold text-emerald-400 mb-4">Property Details</h2>
 <label className="block text-sm text-slate-300 mb-1">Property Type</label>
 <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
 className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 t {PROPERTY_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</opt </select>
 <label className="block text-sm text-slate-300 mb-1">Utility Provider</label>
 <select value={utility} onChange={e => setUtility(e.target.value)}
 className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 t {UTILITIES.map(u => <option key={u.value} value={u.value}>{u.label}</option>) </select>
 <label className="block text-sm text-slate-300 mb-1">Number of Charging Ports:  <input type="range" min="1" max="20" value={numPorts} onChange={e => setNumPort className="w-full mb-4 accent-emerald-500" />
 <label className="block text-sm text-slate-300 mb-1">Installation Complexity</l <select value={complexity} onChange={e => setComplexity(e.target.value)}
 className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 t {INSTALL_COMPLEXITY.map(c => <option key={c.value} value={c.value}>{c.label}< </select>
 </div>
 <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
 <h2 className="text-lg font-bold text-emerald-400 mb-4">Revenue Assumptions</h2 <label className="block text-sm text-slate-300 mb-1">Avg Charge Sessions / Port <input type="range" min="1" max="60" value={monthlyCharges} onChange={e => setM className="w-full mb-4 accent-emerald-500" />
 <label className="block text-sm text-slate-300 mb-1">Price per kWh: <span class <input type="range" min={0.15} max={0.65} step={0.05} value={pricePerKwh} onCha className="w-full mb-4 accent-emerald-500" />
 <label className="block text-sm text-slate-300 mb-1">Avg kWh per Session: <span <input type="range" min={5} max={80} step={5} value={avgKwhPerSession} onChange className="w-full accent-emerald-500" />
 </div>
 </div>
 {/* RIGHT: Results */}
 <div className="space-y-4">
 {/* Big Number: Net Cost */}
 <div className={`rounded-xl p-5 border text-center ${results.netCost === 0 ? 'bg- <p className="text-sm uppercase tracking-wide text-slate-300 mb-1">Your Estimat <p className={`text-5xl font-black ${results.netCost === 0 ? 'text-emerald-400' {results.netCost === 0 ? "FREE" : formatCurrency(results.netCost)}
 </p>
 <p className="text-sm text-slate-400 mt-2">
 {formatCurrency(results.totalIncentives)} in incentives covers {results.cover </p>
 </div>
 {/* Cost Breakdown */}
 <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
 <h2 className="text-lg font-bold text-white mb-4">Project Cost Breakdown</h2>
 <div className="space-y-2 text-sm">
 <div className="flex justify-between"><span className="text-slate-400">Charge <div className="flex justify-between"><span className="text-slate-400">Instal
 <div className="flex justify-between"><span className="text-slate-400">Dedica <div className="flex justify-between font-bold border-t border-slate-600 pt-2 <div className="flex justify-between text-emerald-400"><span>Utility Rebate ( <div className="flex justify-between text-emerald-400"><span>Federal 30C Tax  <div className={`flex justify-between font-black text-lg border-t border-slat <span>NET COST TO YOU</span><span>{results.netCost === 0 ? "$0 (FREE)" : fo </div>
 </div>
 </div>
 {/* Revenue Projection */}
 <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
 <h2 className="text-lg font-bold text-white mb-4">Charging Revenue Projection</ <ProgressBar value={results.totalMonthlyRevenue} max={results.fiveYearRevenue}  <ProgressBar value={results.netAnnualRevenue} max={results.fiveYearRevenue} col <ProgressBar value={results.netFiveYearRevenue} max={results.netFiveYearRevenue {results.netCost > 0 && results.monthsToROI > 0 && (
 <div className="mt-3 text-center bg-slate-700 rounded-lg p-3">
 <p className="text-sm text-slate-400">Payback Period</p>
 <p className="text-2xl font-bold text-blue-400">{results.monthsToROI} month </div>
 )}
 {results.netCost === 0 && (
 <div className="mt-3 text-center bg-emerald-900/30 rounded-lg p-3 border bord <p className="text-sm text-emerald-300">Zero cost means</p>
 <p className="text-2xl font-bold text-emerald-400">100% profit from Day 1</ </div>
 )}
 </div>
 {/* Property Value */}
 <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
 <h2 className="text-lg font-bold text-white mb-3">Additional Value</h2>
 <div className="grid grid-cols-2 gap-3">
 <div className="bg-slate-700 rounded-lg p-3 text-center">
 <p className="text-xs text-slate-400 uppercase">Est. Property Value Increas <p className="text-xl font-bold text-emerald-400">{formatCurrency(results.p </div>
 <div className="bg-slate-700 rounded-lg p-3 text-center">
 <p className="text-xs text-slate-400 uppercase">Annual Maintenance Cost</p>
 <p className="text-xl font-bold text-slate-300">{formatCurrency(results.ann </div>
 </div>
 </div>
 </div>
 </div>
 {/* CTA */}
 <div className="mt-8 mb-6 text-center bg-gradient-to-r from-emerald-900/40 to-blue-90 <h3 className="text-xl font-bold text-white mb-2">Ready to Get Your Free Chargers?< <p className="text-slate-300 text-sm mb-4">Dunamis Charge handles everything: rebat <div className="flex flex-wrap justify-center gap-4">
 <div className="bg-emerald-600 rounded-lg px-6 py-3 font-bold text-white">Call: 2 <div className="bg-blue-600 rounded-lg px-6 py-3 font-bold text-white">info@dunam </div>
 <p className="text-xs text-slate-500 mt-4">Dunamis Charge | 19785 W 12 Mile Road, S </div>
 <p className="text-xs text-slate-600 text-center pb-4">
 Estimates are for informational purposes only. Actual costs, rebate amounts, and ta Federal 30C tax credit expires June 30, 2026. Consult your tax advisor regarding ta </p>
 </div>
 </div>
 );
}
