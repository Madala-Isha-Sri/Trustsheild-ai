import { Search, Bell, Menu } from 'lucide-react';

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 glass-panel border-b border-white/5 sticky top-0 z-30">
      <div className="flex items-center flex-1">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search transactions, agents, logs..." 
            className="w-full bg-surfaceLight/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder:text-gray-600"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors group">
          <Bell className="w-5 h-5 group-hover:animate-pulse-slow" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface"></span>
        </button>
      </div>
    </header>
  );
}
