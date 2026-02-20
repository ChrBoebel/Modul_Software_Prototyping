import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const LeadIntakeChart = ({ chartData, avgTotalLeads }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Lead-Eingang & Qualität</h3>
      </div>
      <div className="w-full h-[180px]">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-200)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--slate-500)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--slate-500)' }} />
            <Tooltip
              cursor={{ fill: 'var(--slate-50)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            {/* Reference Line for Average - Tufte's context principle */}
            <ReferenceLine
              y={avgTotalLeads}
              stroke="var(--slate-400)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Ø ${avgTotalLeads}`,
                position: 'right',
                fontSize: 11,
                fill: 'var(--slate-500)',
                fontWeight: 500
              }}
            />
            {/* Blue for Qualified (Success) */}
            <Bar dataKey="qualified" stackId="a" fill="var(--secondary)" radius={[0, 0, 4, 4]} barSize={32} name="Qualifiziert" />
            {/* Slate for Unqualified (Neutral/Warning) instead of Orange */}
            <Bar dataKey="unqualified" stackId="a" fill="var(--slate-400)" radius={[0, 0, 0, 0]} barSize={32} name="Offen" />
            {/* Red for Rejected (Danger) */}
            <Bar dataKey="rejected" stackId="a" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={32} name="Abgelehnt" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend - Following Tufte's principle of direct labeling */}
      <div className="flex justify-center gap-6 pt-2 border-t border-[var(--slate-100)] mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--secondary)]" />
          <span className="text-[0.6875rem] text-[var(--text-secondary)] font-medium">Qualifiziert</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--slate-400)]" />
          <span className="text-[0.6875rem] text-[var(--text-secondary)] font-medium">Offen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]" />
          <span className="text-[0.6875rem] text-[var(--text-secondary)] font-medium">Abgelehnt</span>
        </div>
      </div>
    </div>
  );
};

export default LeadIntakeChart;
