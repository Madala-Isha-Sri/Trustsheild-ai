import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { RiskMeter } from '../components/RiskMeter';
import { ShieldAlert, Info, AlertTriangle, MonitorSmartphone, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RiskScoring() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | { score: number, confidence: number }>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);
    toast('Initializing AI Risk Engine...', { icon: '🧠' });
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({ score: 82, confidence: 94 });
      toast.error('High risk transaction detected!');
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Risk Scoring Agent</h1>
        <p className="text-gray-400 mt-1">Predict fraudulent transactions using behavioral AI analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Search className="w-5 h-5 mr-2 text-primary" />
            Transaction Analysis Form
          </h2>
          
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Transaction Amount ($)</label>
                <input type="number" defaultValue="2450.00" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Payment Type</label>
                <select className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none">
                  <option>Credit Card (New)</option>
                  <option>PayPal</option>
                  <option>Crypto</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Device ID / Fingerprint</label>
              <input type="text" defaultValue="dev_89x21b_mac_os" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">IP Address</label>
              <input type="text" defaultValue="192.168.45.2 (VPN Detected)" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" size="lg" isLoading={isAnalyzing}>
                {isAnalyzing ? 'Running AI Models...' : 'Analyze Transaction Risk'}
              </Button>
            </div>
          </form>
        </GlassCard>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/10 rounded-2xl"
              >
                <ShieldAlert className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-300">Awaiting Transaction</h3>
                <p className="text-gray-500 mt-2">Submit the form to generate an AI risk prediction.</p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse"></div>
                  <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <ShieldAlert className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white animate-pulse">Analyzing Behavioral Patterns...</h3>
                  <p className="text-sm text-gray-400 mt-2">Cross-referencing global fraud databases</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <GlassCard className="p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-danger to-warning"></div>
                  <h3 className="text-xl font-bold text-white mb-6">AI Risk Prediction</h3>
                  
                  <RiskMeter score={result.score} />
                  
                  <div className="mt-8 flex items-center justify-center space-x-2 text-sm">
                    <span className="text-gray-400">Confidence Score:</span>
                    <span className="text-white font-bold bg-white/10 px-2 py-1 rounded-md">{result.confidence}%</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                    <Info className="w-5 h-5 mr-2 text-primary" />
                    AI Explanation
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start bg-danger/10 p-3 rounded-lg border border-danger/20">
                      <MapPin className="w-5 h-5 text-danger mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">Suspicious IP Location</p>
                        <p className="text-xs text-gray-400 mt-0.5">IP address routes through a known VPN exit node associated with previous fraud rings.</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-warning/10 p-3 rounded-lg border border-warning/20">
                      <MonitorSmartphone className="w-5 h-5 text-warning mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">New Device Detected</p>
                        <p className="text-xs text-gray-400 mt-0.5">Device fingerprint has never been seen on the platform before.</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-danger/10 p-3 rounded-lg border border-danger/20">
                      <AlertTriangle className="w-5 h-5 text-danger mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">High Value Target</p>
                        <p className="text-xs text-gray-400 mt-0.5">Transaction amount is 400% higher than average order value for this category.</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-6 flex space-x-3">
                    <Button variant="danger" className="flex-1">Block Transaction</Button>
                    <Button variant="secondary" className="flex-1">Require Verification</Button>
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
