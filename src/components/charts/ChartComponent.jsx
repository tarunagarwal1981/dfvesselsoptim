import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const ChartComponent = ({
  data,
  metrics,
  chartType = 'line',
  height = 300,
}) => {
  if (!data || data.length === 0 || !metrics || metrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0F1824]/30 rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  // Map data keys to match the chart expected format
  const processedData = data.map((item) => {
    const result = {
      name: item.date || 'N/A',
      ...item,
    };
    return result;
  });

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              fontSize={12}
              tick={{ fill: '#94A3B8' }}
            />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: '#132337',
                border: '1px solid rgba(59, 173, 229, 0.2)',
                borderRadius: '4px',
                color: '#F4F4F4',
              }}
            />
            <Legend />
            {metrics.map((metric, index) => (
              <Bar
                key={index}
                dataKey={metric.id}
                name={metric.label}
                fill={metric.color}
                unit={metric.unit}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              fontSize={12}
              tick={{ fill: '#94A3B8' }}
            />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: '#132337',
                border: '1px solid rgba(59, 173, 229, 0.2)',
                borderRadius: '4px',
                color: '#F4F4F4',
              }}
            />
            <Legend />
            {metrics.map((metric, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={metric.id}
                name={metric.label}
                stroke={metric.color}
                fill={`${metric.color}20`}
                unit={metric.unit}
              />
            ))}
          </AreaChart>
        );

      case 'composed':
        return (
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              fontSize={12}
              tick={{ fill: '#94A3B8' }}
            />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: '#132337',
                border: '1px solid rgba(59, 173, 229, 0.2)',
                borderRadius: '4px',
                color: '#F4F4F4',
              }}
            />
            <Legend />
            {metrics.map((metric, index) => {
              // Alternate between bar and line for composed chart
              return index % 2 === 0 ? (
                <Bar
                  key={index}
                  dataKey={metric.id}
                  name={metric.label}
                  fill={metric.color}
                  unit={metric.unit}
                />
              ) : (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={metric.id}
                  name={metric.label}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: metric.color }}
                  unit={metric.unit}
                />
              );
            })}
          </ComposedChart>
        );

      case 'line':
      default:
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              fontSize={12}
              tick={{ fill: '#94A3B8' }}
            />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: '#132337',
                border: '1px solid rgba(59, 173, 229, 0.2)',
                borderRadius: '4px',
                color: '#F4F4F4',
              }}
            />
            <Legend />
            {metrics.map((metric, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={metric.id}
                name={metric.label}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ r: 3, fill: metric.color }}
                activeDot={{ r: 5 }}
                unit={metric.unit}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
