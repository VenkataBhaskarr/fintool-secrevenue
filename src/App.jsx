


import "./App.css";
import { useEffect, useState, useRef } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const formatNumber = (value) => {
    if (value >= 10000000) {
      return (
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(value / 10000000) + "Cr"
      );
    } else if (value >= 100000) {
      return (
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(value / 100000) + "L"
      );
    } else if (value >= 1000) {
      return (
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(value / 1000) + "K"
      );
    } else {
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
  };

  const formatInputNumber = (value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (numericValue) {
      return new Intl.NumberFormat("en-IN").format(parseInt(numericValue));
    }
    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^\d]/g, "");

    setAmount(numericValue);
    setDisplayAmount(formatInputNumber(value));
  };

  const handleSubmit = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!amount || parseFloat(amount) <= 0) return;

    setIsRunning(true);
    setHasStarted(true);
    setCount(0);

    const yearlyAmount = parseFloat(amount);
    const amountPerSecond = yearlyAmount / (365.25 * 24 * 60 * 60);

    intervalRef.current = setInterval(() => {
      setCount((prev) => prev + amountPerSecond);
    }, 1000);
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    handleStop();
    setCount(0);
    setHasStarted(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-slate-50 dark:from-black dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-md">

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="text-xs text-neutral-500 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-full transition duration-300 shadow-sm"
          >
            {darkMode ? "🌙 dark" : "☀️ light"}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100 tracking-wide">
            Revenue Stream
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-[#121212]/90 backdrop-blur-sm border border-stone-200/60 dark:border-neutral-700 rounded-2xl p-8 shadow-xl shadow-stone-100/50 dark:shadow-black/40 transition-all duration-500">

          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-stone-600 dark:text-neutral-300 tracking-wide">
                Annual Revenue
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-stone-600 dark:text-neutral-400 text-xl">
                  ₹
                </span>
                <input
                  type="text"
                  placeholder="10,00,000"
                  value={displayAmount}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-6 py-6 bg-stone-50/50 dark:bg-neutral-800/50 border border-stone-200/60 dark:border-neutral-700 rounded-2xl text-2xl font-extralight text-stone-700 dark:text-neutral-100 placeholder-stone-300 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-stone-300/40 focus:border-stone-300/80 transition-all duration-500 focus:bg-white/80 dark:focus:bg-neutral-800/70"
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center pt-4">
              {!isRunning ? (
                <button
                  onClick={handleSubmit}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="px-12 py-4 bg-stone-700 dark:bg-neutral-800 text-white text-sm font-semibold hover:bg-stone-800 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-stone-400/50 focus:ring-offset-2 focus:ring-offset-white/80 transition-all duration-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-stone-700 tracking-widest rounded-2xl shadow-lg shadow-stone-200/50 dark:shadow-black/30"
                >
                  START
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleStop}
                    className="px-6 py-2 text-sm font-semibold text-stone-700 dark:text-neutral-100 bg-stone-50/80 dark:bg-neutral-800/50 border border-stone-200/60 dark:border-neutral-700 hover:border-stone-300/80 hover:text-stone-800 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-stone-300/40 focus:ring-offset-2 focus:ring-offset-white/80 transition-all duration-400 tracking-widest rounded-2xl"
                  >
                    PAUSE
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-700 hover:border-rose-300/80 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/40 focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:ring-offset-2 focus:ring-offset-white/80 transition-all duration-400 tracking-widest rounded-2xl"
                  >
                    RESET
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Counter Display */}
          {hasStarted && (
            <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-3xl transition-all duration-700 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-300 tracking-wide">
                  Earned So Far
                </div>
                <div className="text-3xl font-light text-emerald-800 dark:text-emerald-100 tabular-nums tracking-tight">
                  {formatCurrency(count)}
                </div>
                {isRunning && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="w-2.5 h-2.5 bg-emerald-700 rounded-full animate-pulse shadow-sm"></div>
                    <span className="text-sm text-emerald-600 dark:text-emerald-300 tracking-wide">
                      Live
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metrics */}
          {amount && parseFloat(amount) > 0 && (
  <div className="mt-8 pt-6 border-t border-stone-200/60 dark:border-neutral-700">
    <div className="grid grid-cols-3 gap-4">
      {/* Daily Card */}
      <div className="text-center p-6 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 dark:from-[#0c1a30] dark:to-[#0a1b2d] border border-blue-200/40 dark:border-blue-900 rounded-2xl backdrop-blur-sm">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-300 tracking-wide mb-3">
          Daily
        </div>
        <div className="text-lg text-blue-800 dark:text-blue-100 tabular-nums overflow-auto">
          ₹{formatNumber(parseFloat(amount) / 365.25)}
        </div>
      </div>

      {/* Hourly Card */}
      <div className="text-center p-6 bg-gradient-to-br from-purple-50/60 to-violet-50/60 dark:from-[#1a0f2e] dark:to-[#25103d] border border-purple-200/40 dark:border-purple-900 rounded-2xl backdrop-blur-sm">
        <div className="text-xs font-semibold text-purple-600 dark:text-purple-300 tracking-wide mb-3">
          Hourly
        </div>
        <div className="text-lg text-purple-800 dark:text-purple-100 tabular-nums overflow-auto">
          ₹{formatNumber(parseFloat(amount) / (365.25 * 24))}
        </div>
      </div>

      {/* Minute Card */}
      <div className="text-center p-6 bg-gradient-to-br from-amber-50/60 to-orange-50/60 dark:from-[#2e1d05] dark:to-[#402902] border border-amber-200/40 dark:border-amber-900 rounded-2xl backdrop-blur-sm">
        <div className="text-xs font-semibold text-amber-600 dark:text-amber-300 tracking-wide mb-3">
          Minute
        </div>
        <div className="text-lg text-amber-800 dark:text-amber-100 tabular-nums overflow-auto">
          ₹{formatNumber(parseFloat(amount) / (365.25 * 24 * 60))}
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default App;
