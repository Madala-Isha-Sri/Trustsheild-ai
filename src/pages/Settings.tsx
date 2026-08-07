import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { User, Bell, Shield, Key, Database, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Settings</h1>
        <p className="text-gray-400 mt-1">Configure TrustShield AI engine parameters and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: User, active: true },
            { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
            { id: 'security', label: 'Security & Access', icon: Shield, active: false },
            { id: 'api', label: 'API Keys', icon: Key, active: false },
            { id: 'models', label: 'AI Models', icon: Database, active: false },
          ].map(tab => (
            <button 
              key={tab.id}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                tab.active ? 'bg-primary/20 text-primary border border-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-3" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          <form onSubmit={handleSave}>
            <GlassCard className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                  JD
                </div>
                <div>
                  <Button variant="secondary" size="sm" type="button">Change Avatar</Button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">First Name</label>
                  <input type="text" defaultValue="Jane" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Last Name</label>
                  <input type="text" defaultValue="Doe" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <input type="email" defaultValue="jane.doe@trustshield.ai" className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none">
                      <option>English (US)</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end space-x-3">
                <Button variant="ghost" type="button">Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </GlassCard>
          </form>
        </div>
      </div>
    </div>
  );
}
