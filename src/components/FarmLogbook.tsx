import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Filter,
  Download,
  Sprout
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FarmActivityLog, FarmProfile } from '../types';
import { INITIAL_ACTIVITY_LOGS } from '../data/mockData';

interface FarmLogbookProps {
  farmProfile: FarmProfile;
}

export const FarmLogbook: React.FC<FarmLogbookProps> = ({ farmProfile }) => {
  const [logs, setLogs] = useState<FarmActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [plotName, setPlotName] = useState<string>('North Plot (Tomato)');
  const [activityType, setActivityType] = useState<FarmActivityLog['activityType']>('Fertigation');
  const [details, setDetails] = useState<string>('');
  const [amount, setAmount] = useState<number>(1500);
  const [isRevenue, setIsRevenue] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const newLog: FarmActivityLog = {
      id: `log-${Date.now()}`,
      date,
      plotName,
      activityType,
      details,
      costOrRevenue: isRevenue ? Math.abs(amount) : -Math.abs(amount),
    };

    setLogs([newLog, ...logs]);
    setIsAddModalOpen(false);
    setDetails('');
    setAmount(1000);

    if (isRevenue) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  const totalRevenue = logs
    .filter((l) => l.costOrRevenue > 0)
    .reduce((acc, curr) => acc + curr.costOrRevenue, 0);

  const totalExpenses = logs
    .filter((l) => l.costOrRevenue < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.costOrRevenue), 0);

  const netProfit = totalRevenue - totalExpenses;
  const roiPct = totalExpenses > 0 ? ((netProfit / totalExpenses) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-700 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Farm Operational Journal
            </span>
            <span className="text-xs text-lime-300 font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Kharif/Rabi Season Ledger
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Farm Activity Logbook & Profit Ledger
          </h2>
          <p className="text-sm text-emerald-200 mt-1 max-w-2xl">
            Track day-to-day farm inputs, labor costs, chemical applications, and harvest produce sales to maintain automated seasonal profitability records.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold rounded-xl text-xs transition shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-950" /> Record New Farm Activity
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Harvest Revenue
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {farmProfile.currency} {totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">From grain and produce sales</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Input & Labor Expenses
          </span>
          <p className="text-2xl font-black text-red-600 mt-1">
            {farmProfile.currency} {totalExpenses.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Seeds, fertilizers, sprays & labor</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-300 shadow-xs bg-emerald-50/40">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Net Farm Profit (ROI)
          </span>
          <p className={`text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-900' : 'text-red-700'}`}>
            {farmProfile.currency} {netProfit.toLocaleString()} ({roiPct}%)
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            Seasonal Net Return Margin
          </p>
        </div>

      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-slate-900">
            Recorded Farm Activities & Input Journal
          </h3>
          <span className="text-xs text-slate-500">
            {logs.length} Entries Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 rounded-l-lg">Date</th>
                <th className="py-3 px-4">Sector / Plot</th>
                <th className="py-3 px-4">Activity Category</th>
                <th className="py-3 px-4">Activity Details</th>
                <th className="py-3 px-4">Amount ({farmProfile.currency})</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => {
                const isIncome = log.costOrRevenue > 0;
                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {log.plotName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          log.activityType === 'Sale'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.activityType === 'Fertigation'
                            ? 'bg-sky-100 text-sky-800'
                            : log.activityType === 'Pesticide Spray'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {log.activityType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-md">
                      {log.details}
                    </td>
                    <td
                      className={`py-3 px-4 font-extrabold whitespace-nowrap ${
                        isIncome ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {isIncome ? `+${farmProfile.currency} ${log.costOrRevenue.toLocaleString()}` : `-${farmProfile.currency} ${Math.abs(log.costOrRevenue).toLocaleString()}`}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">
              Log Farm Activity & Expense/Revenue
            </h3>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Activity Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Field Plot
                </label>
                <input
                  type="text"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Fertigation">Fertigation</option>
                    <option value="Pesticide Spray">Pesticide Spray</option>
                    <option value="Weeding">Weeding / Interculture</option>
                    <option value="Sowing">Sowing / Nursery</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Sale">Crop Produce Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nature
                  </label>
                  <select
                    value={isRevenue ? 'revenue' : 'expense'}
                    onChange={(e) => setIsRevenue(e.target.value === 'revenue')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                  >
                    <option value="expense">Expense (-Cost)</option>
                    <option value="revenue">Revenue (+Sale)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Amount ({farmProfile.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Details / Notes
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Applied 20kg Urea + Zinc via drip, labor 2 workers..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-600 shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
