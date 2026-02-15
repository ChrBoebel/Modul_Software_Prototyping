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
import { theme } from '../../../../theme/colors';

const LeadIntakeChart = ({ chartData, avgTotalLeads }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Lead-Eingang & Qualität</h3>
      </div>
      <div style={{ width: '100%', height: 180 }}>
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
              stroke={theme.colors.slate400}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Ø ${avgTotalLeads}`,
                position: 'right',
                fontSize: 11,
                fill: theme.colors.slate500,
                fontWeight: 500
              }}
            />
            {/* Blue for Qualified (Success) */}
            <Bar dataKey="qualified" stackId="a" fill={theme.colors.secondary} radius={[0, 0, 4, 4]} barSize={32} name="Qualifiziert" />
            {/* Slate for Unqualified (Neutral/Warning) instead of Orange */}
            <Bar dataKey="unqualified" stackId="a" fill={theme.colors.slate400} radius={[0, 0, 0, 0]} barSize={32} name="Offen" />
            {/* Red for Rejected (Danger) */}
            <Bar dataKey="rejected" stackId="a" fill={theme.colors.primary} radius={[4, 4, 0, 0]} barSize={32} name="Abgelehnt" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend - Following Tufte's principle of direct labeling */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--slate-100)',
        marginTop: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.colors.secondary }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Qualifiziert</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.colors.slate400 }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Offen</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.colors.primary }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Abgelehnt</span>
        </div>
      </div>
    </div>
  );
};

export default LeadIntakeChart;
