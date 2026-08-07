import { GlassCard } from '../components/GlassCard';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { fraudCasesData, counterfeitCategories, reviewClassification } from '../data/dummyData';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

export default function Analytics() {
  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Analytics</h1>
        <p className="text-gray-400 mt-1">Deep dive into marketplace trust & safety metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-white">Risk Trends Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fraudCasesData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="risk" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-white">Review Classification Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewClassification}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {reviewClassification.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9ca3af' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-6 text-white">Counterfeit Detection by Category</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={counterfeitCategories} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
              <XAxis type="number" stroke="#ffffff50" axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#ffffff50" axisLine={false} tickLine={false} width={100} />
              <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {counterfeitCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
