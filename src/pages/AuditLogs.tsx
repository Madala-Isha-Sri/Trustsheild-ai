import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { auditLogs } from '../data/dummyData';
import { Filter, Download, Search } from 'lucide-react';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Timestamp', accessor: 'timestamp' },
    { 
      header: 'Agent', 
      accessor: 'agent',
      render: (val: string) => <span className="font-medium text-white">{val}</span>
    },
    { header: 'Action Taken', accessor: 'action' },
    { 
      header: 'Decision', 
      accessor: 'decision',
      render: (val: string) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-surfaceLight border border-white/10 text-xs">
          {val}
        </span>
      )
    },
    { header: 'Reason', accessor: 'reason', render: (val: string) => <span className="text-gray-400">{val}</span> },
    { 
      header: 'Severity', 
      accessor: 'severity',
      render: (val: string) => {
        const statusMap: any = {
          high: 'danger',
          medium: 'warning',
          low: 'safe'
        };
        return <StatusBadge status={statusMap[val]} text={val.toUpperCase()} />;
      }
    },
  ];

  const filteredLogs = auditLogs.filter(log => 
    Object.values(log).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Audit Logs</h1>
          <p className="text-gray-400 mt-1">Immutable record of all AI decisions and platform actions.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button variant="secondary"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search logs by ID, agent, or reason..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surfaceLight/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <DataTable columns={columns} data={filteredLogs} />
        
        <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
          <span>Showing 1 to {filteredLogs.length} of {filteredLogs.length} entries</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm" disabled>Next</Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
