import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { theme } from '../../../theme/colors';

const TrafficTab = ({ showToast }) => {
  const [filterPeriod, setFilterPeriod] = useState('7d');

  // Mock traffic data by source
  const trafficBySource = [
    { source: 'Google Ads', besucher: 12500, leads: 340 },
    { source: 'Facebook', besucher: 8900, leads: 180 },
    { source: 'Direkt', besucher: 6200, leads: 95 },
    { source: 'Email', besucher: 4100, leads: 220 },
    { source: 'Organic', besucher: 3500, leads: 85 },
    { source: 'Referral', besucher: 1200, leads: 42 }
  ];

  // Mock traffic timeline data
  const trafficTimeline = [
    { date: 'Mo', besucher: 4200, leads: 120 },
    { date: 'Di', besucher: 5100, leads: 145 },
    { date: 'Mi', besucher: 4800, leads: 132 },
    { date: 'Do', besucher: 5500, leads: 168 },
    { date: 'Fr', besucher: 6200, leads: 185 },
    { date: 'Sa', besucher: 3800, leads: 95 },
    { date: 'So', besucher: 3100, leads: 78 }
  ];

  return (
    <div className="traffic-tab">
      <h2 className="sr-only">Traffic Analysen</h2>
      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="traffic-period-filter">Zeitraum</label>
          <select
            id="traffic-period-filter"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="7d">Letzte 7 Tage</option>
            <option value="30d">Letzte 30 Tage</option>
            <option value="90d">Letzte 90 Tage</option>
          </select>
        </div>
      </div>

      <div className="traffic-charts-grid">
        {/* Besucher nach Quelle */}
        <div className="card">
          <div className="card-header">
            <h3>Besucher nach Quelle</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trafficBySource} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate200} />
                <XAxis type="number" stroke={theme.colors.slate400} />
                <YAxis dataKey="source" type="category" width={100} stroke={theme.colors.slate400} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.slate50,
                    border: `1px solid ${theme.colors.slate200}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="besucher" fill={theme.colors.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads nach Quelle */}
        <div className="card">
          <div className="card-header">
            <h3>Leads nach Quelle</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trafficBySource} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate200} />
                <XAxis type="number" stroke={theme.colors.slate400} />
                <YAxis dataKey="source" type="category" width={100} stroke={theme.colors.slate400} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.slate50,
                    border: `1px solid ${theme.colors.slate200}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="leads" fill={theme.colors.secondary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Verlauf */}
        <div className="card full-width">
          <div className="card-header">
            <h3>Traffic Verlauf</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trafficTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate200} />
                <XAxis dataKey="date" stroke={theme.colors.slate400} />
                <YAxis stroke={theme.colors.slate400} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.slate50,
                    border: `1px solid ${theme.colors.slate200}`,
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="besucher"
                  stroke={theme.colors.primary}
                  strokeWidth={2}
                  dot={{ fill: theme.colors.primary }}
                  name="Besucher"
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke={theme.colors.secondary}
                  strokeWidth={2}
                  dot={{ fill: theme.colors.secondary }}
                  name="Leads"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficTab;
