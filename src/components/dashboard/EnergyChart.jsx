import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../ui/Button';

export const EnergyChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('week');

  const chartData = data.labels.map((label, index) => ({
    time: label,
    heute: data.datasets[0].data[index],
    gestern: data.datasets[1].data[index],
  }));

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Energieverbrauch</span>
        <div className="btn-group">
          <Button
            onClick={() => setTimeRange('day')}
            className={timeRange === 'day' ? 'active' : ''}
          >
            Tag
          </Button>
          <Button
            onClick={() => setTimeRange('week')}
            className={timeRange === 'week' ? 'active' : ''}
          >
            Woche
          </Button>
          <Button
            onClick={() => setTimeRange('month')}
            className={timeRange === 'month' ? 'active' : ''}
          >
            Monat
          </Button>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              stroke="var(--text-tertiary)"
              style={{ fontSize: '10px' }}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              style={{ fontSize: '10px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="heute"
              stroke="#e2001a"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gestern"
              stroke="#2358a1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
