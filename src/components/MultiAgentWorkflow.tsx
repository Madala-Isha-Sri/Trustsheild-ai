import { motion } from 'framer-motion';
import { ShoppingCart, ShieldAlert, ScanSearch, MessageSquareWarning, BrainCircuit, ShieldCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';

const nodes = [
  { id: 'customer', title: 'Customer Transaction', icon: ShoppingCart, status: 'success', delay: 0 },
  { id: 'risk', title: 'Risk Scoring Agent', icon: ShieldAlert, status: 'running', delay: 0.2 },
  { id: 'auth', title: 'Authenticity Agent', icon: ScanSearch, status: 'thinking', delay: 0.4 },
  { id: 'review', title: 'Review Moderation', icon: MessageSquareWarning, status: 'running', delay: 0.6 },
  { id: 'engine', title: 'AI Decision Engine', icon: BrainCircuit, status: 'thinking', delay: 0.8 },
  { id: 'decision', title: 'Final Decision', icon: ShieldCheck, status: 'safe', delay: 1.0 },
];

export function MultiAgentWorkflow() {
  return (
    <GlassCard className="p-6 md:p-8">
      <h3 className="text-xl font-bold text-white mb-8">Multi-Agent AI Workflow</h3>
      
      <div className="relative">
        {/* Animated Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-surfaceLight -translate-y-1/2 rounded-full hidden lg:block">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary via-purple-500 to-cyan-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 relative z-10">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center">
              {/* Mobile Vertical Line */}
              {i !== 0 && (
                <div className="h-8 w-1 bg-surfaceLight lg:hidden my-2">
                  <motion.div 
                    className="w-full bg-gradient-to-b from-primary to-cyan-500"
                    initial={{ height: "0%" }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
                  />
                </div>
              )}
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: node.delay, duration: 0.5 }}
                className="w-full"
              >
                <div className="bg-surface border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-surfaceLight transition-colors shadow-xl">
                  <div className={`p-3 rounded-xl mb-3 ${node.status === 'safe' || node.status === 'success' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                    <node.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2 h-10 flex items-center justify-center">{node.title}</h4>
                  <StatusBadge status={node.status as any} />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
