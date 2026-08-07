import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

interface DataTableProps extends HTMLAttributes<HTMLDivElement> {
  columns: { header: string; accessor: string; render?: (val: any, row: any) => ReactNode }[];
  data: any[];
}

export function DataTable({ columns, data, className, ...props }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-white/5 bg-surface/30 backdrop-blur-sm", className)} {...props}>
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs uppercase bg-surfaceLight/50 text-gray-400 border-b border-white/5">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 font-medium whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4">
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
