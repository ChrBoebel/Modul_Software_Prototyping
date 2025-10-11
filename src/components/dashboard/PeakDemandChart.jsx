import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const PeakDemandChart = ({ data }) => {
  const { labels, today, yesterday, lastWeek } = data;

  // Transform data for Recharts
  const chartData = labels.map((label, index) => ({
    time: label,
    today: today[index],
    yesterday: yesterday[index],
    lastWeek: lastWeek[index]
  }));

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Spitzenlast-Verlauf</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FD951F" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FD951F" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorYesterday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="var(--text-tertiary)"
              style={{ fontSize: '11px' }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              style={{ fontSize: '11px' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              labelStyle={{ color: 'var(--text)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="lastWeek"
              name="Letzte Woche"
              stroke="#6b7280"
              strokeWidth={2}
              fill="url(#colorLastWeek)"
            />
            <Area
              type="monotone"
              dataKey="yesterday"
              name="Gestern"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorYesterday)"
            />
            <Area
              type="monotone"
              dataKey="today"
              name="Heute"
              stroke="#FD951F"
              strokeWidth={2}
              fill="url(#colorToday)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
