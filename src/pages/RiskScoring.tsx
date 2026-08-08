import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { RiskMeter } from '../components/RiskMeter';
import {
  ShieldAlert,
  Info,
  AlertTriangle,
  MonitorSmartphone,
  MapPin,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateRisk } from '../services/api';

interface RiskResult {
  riskScore: number;
  riskLevel: string;
  confidence: number;
  reason: string[];
}

export default function RiskScoring() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [result, setResult] = useState<RiskResult | null>(null);

  const handleAnalyze = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsAnalyzing(true);
    setResult(null);

    toast('Connecting to AI Risk Engine...', {
      icon: '🧠',
    });

    const form = e.currentTarget;
    const formData = new FormData(form);

    const transactionAmount = Number(
      formData.get('transactionAmount')
    );

    const cardType = String(
      formData.get('cardType')
    );

    try {
      /*
       * Send transaction data to FastAPI backend
       *
       * POST http://localhost:8000/risk-score
       */

      const data = await calculateRisk({
        transactionAmount: transactionAmount,
        cardType: cardType,

        // These values are currently being sent
        // as additional behavioral indicators.
        deviceMismatch: true,
        countryMismatch: true,
        refundRate: 0.55,
        accountAgeDays: 3,
        transactionHour: 3,
        isNewDevice: true,
        velocityCount24h: 12,
      });

      console.log('Backend response:', data);

      /*
       * Store actual backend response
       */

      setResult({
        riskScore: data.riskScore,
        riskLevel: data.riskLevel,
        confidence: data.confidence,
        reason: data.reason || [],
      });

      /*
       * Show result notification
       */

      if (data.riskLevel === 'High') {
        toast.error('High risk transaction detected!');
      } else if (data.riskLevel === 'Medium') {
        toast('Medium risk transaction detected.', {
          icon: '⚠️',
        });
      } else {
        toast.success('Low risk transaction');
      }
    } catch (error) {
      console.error('Risk API error:', error);

      toast.error(
        'Could not connect to the backend. Check if FastAPI is running.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Risk Scoring Agent
        </h1>

        <p className="text-gray-400 mt-2">
          Predict fraudulent transactions using behavioral AI analysis.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ============================= */}
        {/* TRANSACTION FORM */}
        {/* ============================= */}

        <GlassCard className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Search className="w-5 h-5 mr-2 text-primary" />

            Transaction Analysis Form
          </h2>

          <form
            onSubmit={handleAnalyze}
            className="space-y-4"
          >

            {/* Transaction Amount + Payment Type */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Transaction Amount */}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Transaction Amount ($)
                </label>

                <input
                  type="number"
                  name="transactionAmount"
                  defaultValue="2450.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Payment Type */}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Payment Type
                </label>

                <select
                  name="cardType"
                  defaultValue="Credit Card"
                  className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                >
                  <option value="Credit Card">
                    Credit Card
                  </option>

                  <option value="PayPal">
                    PayPal
                  </option>

                  <option value="Crypto">
                    Crypto
                  </option>
                </select>
              </div>
            </div>

            {/* Device ID */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Device ID / Fingerprint
              </label>

              <input
                type="text"
                defaultValue="dev_89x21b_mac_os"
                className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* IP Address */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                IP Address
              </label>

              <input
                type="text"
                defaultValue="192.168.45.2 (VPN Detected)"
                className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isAnalyzing}
              >
                {isAnalyzing
                  ? 'Running AI Models...'
                  : 'Analyze Transaction Risk'}
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* ============================= */}
        {/* RESULT SECTION */}
        {/* ============================= */}

        <div className="relative">

          <AnimatePresence mode="wait">

            {/* ============================= */}
            {/* EMPTY STATE */}
            {/* ============================= */}

            {!result && !isAnalyzing && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/10 rounded-2xl"
              >
                <ShieldAlert className="w-16 h-16 text-gray-600 mb-4" />

                <h3 className="text-xl font-bold text-gray-300">
                  Awaiting Transaction
                </h3>

                <p className="text-gray-500 mt-2">
                  Submit the form to generate an AI risk prediction.
                </p>
              </motion.div>
            )}

            {/* ============================= */}
            {/* ANALYZING STATE */}
            {/* ============================= */}

            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">

                  <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse"></div>

                  <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>

                  <ShieldAlert className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>

                <div className="text-center">

                  <h3 className="text-lg font-bold text-white animate-pulse">
                    Analyzing Behavioral Patterns...
                  </h3>

                  <p className="text-sm text-gray-400 mt-2">
                    Sending transaction to AI risk engine
                  </p>

                </div>
              </motion.div>
            )}

            {/* ============================= */}
            {/* RESULT */}
            {/* ============================= */}

            {result && (
              <motion.div
                key="result"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="space-y-6"
              >

                {/* Risk Score Card */}

                <GlassCard className="p-8 text-center relative overflow-hidden">

                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-danger to-warning"></div>

                  <h3 className="text-xl font-bold text-white mb-6">
                    AI Risk Prediction
                  </h3>

                  {/* REAL BACKEND SCORE */}

                  <RiskMeter score={result.riskScore} />

                  {/* Risk Level */}

                  <div className="mt-4">
                    <span className="text-sm text-gray-400">
                      Risk Level:
                    </span>

                    <span className="ml-2 text-white font-bold">
                      {result.riskLevel}
                    </span>
                  </div>

                  {/* Confidence */}

                  <div className="mt-6 flex items-center justify-center space-x-2 text-sm">

                    <span className="text-gray-400">
                      Confidence Score:
                    </span>

                    <span className="text-white font-bold bg-white/10 px-2 py-1 rounded-md">
                      {result.confidence}%
                    </span>

                  </div>
                </GlassCard>

                {/* ============================= */}
                {/* AI EXPLANATION */}
                {/* ============================= */}

                <GlassCard className="p-6">

                  <h3 className="text-lg font-semibold text-white flex items-center mb-4">

                    <Info className="w-5 h-5 mr-2 text-primary" />

                    AI Explanation

                  </h3>

                  <ul className="space-y-3">

                    {result.reason.length > 0 ? (

                      result.reason.map(
                        (reason, index) => (

                          <li
                            key={index}
                            className={`flex items-start p-3 rounded-lg border ${
                              index % 2 === 0
                                ? 'bg-danger/10 border-danger/20'
                                : 'bg-warning/10 border-warning/20'
                            }`}
                          >

                            {index % 2 === 0 ? (
                              <AlertTriangle className="w-5 h-5 text-danger mt-0.5 mr-3 flex-shrink-0" />
                            ) : (
                              <MonitorSmartphone className="w-5 h-5 text-warning mt-0.5 mr-3 flex-shrink-0" />
                            )}

                            <div>

                              <p className="text-sm font-medium text-white">
                                {reason}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                Detected by the AI risk scoring model.
                              </p>

                            </div>

                          </li>
                        )
                      )

                    ) : (

                      <li className="text-gray-400 text-sm">
                        No specific risk factors were returned by the AI model.
                      </li>

                    )}

                  </ul>

                  {/* Buttons */}

                  <div className="mt-6 flex space-x-3">

                    <Button
                      variant="danger"
                      className="flex-1"
                      type="button"
                    >
                      Block Transaction
                    </Button>

                    <Button
                      variant="secondary"
                      className="flex-1"
                      type="button"
                    >
                      Require Verification
                    </Button>

                  </div>

                </GlassCard>

              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}