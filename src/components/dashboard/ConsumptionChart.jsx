import React, { useState } from 'react';
import { BarChart3, Settings, RefreshCw } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import ChartComponent from '../charts/ChartComponent';

// Define chart metrics
const CONSUMPTION_METRICS = [
  {
    id: 'totalConsumption',
    label: 'Total Consumption',
    unit: 'MT/d',
    color: '#6366F1',
  },
  {
    id: 'meConsumption',
    label: 'ME Consumption',
    unit: 'MT/d',
    color: '#8B5CF6',
  },
  {
    id: 'aeConsumption',
    label: 'AE Consumption',
    unit: 'MT/d',
    color: '#5EEAD4',
  },
  {
    id: 'boilerConsumption',
    label: 'Boiler Consumption',
    unit: 'MT/d',
    color: '#FCD34D',
  },
  { id: 'speed', label: 'Speed', unit: 'knots', color: '#F97316' },
  { id: 'engineData.load', label: 'Engine Load', unit: '%', color: '#F59E0B' },
];

const ChartTypeTabs = ({ activeType, onChange }) => {
  const types = [
    { id: 'line', label: 'Line' },
    { id: 'bar', label: 'Bar' },
    { id: 'area', label: 'Area' },
    { id: 'composed', label: 'Composed' },
  ];

  return (
    <div className="inline-flex rounded-md overflow-hidden bg-[#132337]">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onChange(type.id)}
          className={`px-3 py-1.5 text-xs font-medium ${
            activeType === type.id
              ? 'bg-[#3BADE5]/20 text-[#3BADE5]'
              : 'text-gray-400 hover:bg-[#0F1824]/50 hover:text-white'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

const MetricSelector = ({
  metrics,
  selectedMetrics,
  onChange,
  maxSelections = 3,
}) => {
  return (
    <div className="bg-[#132337] border border-[#3BADE5]/20 rounded-lg p-3 max-h-60 overflow-y-auto">
      <div className="mb-2 flex justify-between items-center">
        <h4 className="text-xs text-gray-400">
          Select Metrics (max {maxSelections})
        </h4>
        <button
          onClick={() => onChange([])}
          className="text-xs text-gray-400 hover:text-white flex items-center"
        >
          <RefreshCw size={10} className="mr-1" />
          Reset
        </button>
      </div>
      <div className="space-y-1.5">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center">
            <input
              type="checkbox"
              id={`metric-${metric.id}`}
              checked={selectedMetrics.includes(metric.id)}
              onChange={() => {
                if (selectedMetrics.includes(metric.id)) {
                  // Remove from selection
                  onChange(selectedMetrics.filter((id) => id !== metric.id));
                } else {
                  // Add to selection if under max
                  if (selectedMetrics.length < maxSelections) {
                    onChange([...selectedMetrics, metric.id]);
                  }
                }
              }}
              className="mr-2"
            />
            <label
              htmlFor={`metric-${metric.id}`}
              className="text-xs flex items-center cursor-pointer"
            >
              <div
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: metric.color }}
              ></div>
              {metric.label} {metric.unit ? `(${metric.unit})` : ''}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConsumptionChart = ({
  data,
  isLoading = false,
  onRefresh = () => {},
}) => {
  const [chartType, setChartType] = useState('line');
  const [showMetricSelector, setShowMetricSelector] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState([
    'totalConsumption',
    'speed',
  ]);

  // Prepare metrics in the format expected by ChartComponent
  const chartMetrics = selectedMetrics
    .map((metricId) => {
      return CONSUMPTION_METRICS.find((m) => m.id === metricId);
    })
    .filter(Boolean);

  // Process nested properties like engineData.load
  const processedData =
    data?.map((item) => {
      const newItem = { ...item };
      CONSUMPTION_METRICS.forEach((metric) => {
        // Handle nested properties (like engineData.load)
        if (metric.id.includes('.')) {
          const [parent, child] = metric.id.split('.');
          if (item[parent] && item[parent][child] !== undefined) {
            newItem[metric.id] = item[parent][child];
          }
        }
      });
      return newItem;
    }) || [];

  const handleConfigure = () => {
    setShowMetricSelector(!showMetricSelector);
  };

  return (
    <DashboardCard
      title="Consumption & Performance"
      isLoading={isLoading}
      onConfigure={handleConfigure}
    >
      <div className="relative">
        {/* Chart controls */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <BarChart3 size={16} className="text-[#3BADE5] mr-2" />
            <span className="text-xs text-gray-400">
              {chartMetrics.map((m) => m.label).join(' / ')}
            </span>
          </div>

          <ChartTypeTabs activeType={chartType} onChange={setChartType} />
        </div>

        {/* Chart */}
        <ChartComponent
          data={processedData}
          metrics={chartMetrics}
          chartType={chartType}
          height={250}
        />

        {/* Metrics selector popup */}
        {showMetricSelector && (
          <div className="absolute top-0 right-0 mt-10 z-10 shadow-lg">
            <MetricSelector
              metrics={CONSUMPTION_METRICS}
              selectedMetrics={selectedMetrics}
              onChange={setSelectedMetrics}
              maxSelections={3}
            />
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default ConsumptionChart;
