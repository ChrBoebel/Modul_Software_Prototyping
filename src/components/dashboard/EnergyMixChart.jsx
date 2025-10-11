import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const EnergyMixChart = ({ data }) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.data[index],
  }));

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Energie-Mix</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
              labelStyle={{
                fontSize: '11px',
                fill: 'var(--text)',
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={data.colors[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
