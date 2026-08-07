import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { MultiAgentWorkflow } from '../components/MultiAgentWorkflow';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { fraudCasesData, counterfeitCategories, reviewClassification } from '../data/dummyData';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  MessageSquareX,
  UserX,
  Shield,
  Search,
} from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const kpis = [
  { title: 'Total Transactions', value: '2.4M', trend: '+12%', icon: Activity, color: 'text-blue-500' },
  { title: 'Fraud Cases', value: '1,284', trend: '-5%', icon: AlertTriangle, color: 'text-danger' },
  { title: 'Counterfeit Listings', value: '842', trend: '-18%', icon: ShieldAlert, color: 'text-warning' },
  { title: 'Fake Reviews', value: '15.2k', trend: '+2%', icon: MessageSquareX, color: 'text-purple-500' },
  { title: 'Blocked Sellers', value: '143', trend: '+8%', icon: UserX, color: 'text-red-500' },
  { title: 'Avg Risk Score', value: '24', trend: '-2', icon: Shield, color: 'text-success' },
];

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Command Center</h1>
          <p className="text-gray-400 mt-1">Real-time marketplace integrity monitoring.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="secondary">Export Report</Button>
          <Button onClick={() => navigate('/risk-scoring')}>Manual Analysis</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <kpi.icon className={`w-16 h-16 ${kpi.color}`} />
              </div>
              <p className="text-sm text-gray-400 font-medium">{kpi.title}</p>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">{kpi.value}</span>
                <span className={`text-xs font-semibold ${kpi.trend.startsWith('+') ? (kpi.trend.includes('Risk') || kpi.trend.includes('Fraud') ? 'text-danger' : 'text-success') : (kpi.trend.includes('Risk') || kpi.trend.includes('Fraud') ? 'text-success' : 'text-danger')}`}>
                  {kpi.trend}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Multi-Agent Workflow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <MultiAgentWorkflow />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-white">Fraud Cases Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fraudCasesData}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-white">Counterfeit by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={counterfeitCategories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} cursor={{ fill: '#ffffff05' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* AI Agents Status */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Active AI Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Risk Scoring Agent', icon: Shield, desc: 'Predicts fraudulent transactions using behavioral analysis.', acc: '97%', path: '/risk-scoring' },
            { name: 'Authenticity Agent', icon: Search, desc: 'Detects counterfeit products using AI image analysis.', acc: '96%', path: '/counterfeit-detection' },
            { name: 'Review Moderation Agent', icon: MessageSquareX, desc: 'Detects fake and AI-generated reviews.', acc: '98%', path: '/review-moderation' }
          ].map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <GlassCard className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-surface/50 border border-white/10">
                    <agent.icon className="w-6 h-6 text-primary" />
                  </div>
                  <StatusBadge status="running" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{agent.name}</h4>
                <p className="text-gray-400 text-sm flex-1">{agent.desc}</p>
                
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</p>
                    <p className="text-lg font-bold text-success">{agent.acc}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate(agent.path)}>Open Module</Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
