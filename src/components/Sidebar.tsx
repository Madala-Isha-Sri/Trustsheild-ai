import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, ScanSearch, MessageSquareWarning, FileSignature, BarChart3, Settings, Shield } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Risk Scoring', path: '/risk-scoring', icon: ShieldAlert },
  { name: 'Counterfeit Detection', path: '/counterfeit-detection', icon: ScanSearch },
  { name: 'Review Moderation', path: '/review-moderation', icon: MessageSquareWarning },
  { name: 'Audit Logs', path: '/audit-logs', icon: FileSignature },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center h-16 px-6 border-b border-white/5">
          <Shield className="w-8 h-8 text-primary mr-3" />
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">TrustShield AI</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Enterprise Platform</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 mr-3 transition-colors duration-200",
                    isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-300"
                  )} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center p-3 rounded-xl bg-surface/50 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">Platform Ops</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
