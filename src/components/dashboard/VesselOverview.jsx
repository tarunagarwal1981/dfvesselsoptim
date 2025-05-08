import React, { useState } from 'react';
import {
  Ship,
  Thermometer,
  Gauge,
  Wind,
  Droplet,
  Navigation,
  Fuel,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import StatusCard from '../ui/StatusCard';

const VesselOverview = ({
  vesselData,
  isLoading = false,
  onViewDetails = () => {},
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Skip rendering if no data is available
  if (!vesselData && !isLoading) {
    return (
      <div className="p-4 bg-[#0F1824]/20 rounded-lg backdrop-blur-sm border border-[#3BADE5]/10 text-center">
        <p className="text-gray-400">No vessel data available</p>
      </div>
    );
  }

  // Helper function to show tooltip
  const showTooltip = (content, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipContent(content);
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 10,
    });
    setTooltipVisible(true);
  };

  // Create content for tank pressure tooltip
  const tankPressureTooltipContent = (
    <div>
      <div className="mb-2">Tank Pressures (barg):</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Tank 1:</span>
          </div>
          <span className="font-medium">
            {isLoading ? '...' : vesselData?.tankPressure?.tank1 || '0.000'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Tank 2:</span>
          </div>
          <span className="font-medium">
            {isLoading ? '...' : vesselData?.tankPressure?.tank2 || '0.000'}
          </span>
        </div>
      </div>
    </div>
  );

  // Create content for tank temperatures tooltip
  const tankTempTooltipContent = (
    <div>
      <div className="mb-2">Tank Temperatures (°C):</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span>Tank 1:</span>
          </div>
          <span className="font-medium">
            {isLoading ? '...' : vesselData?.cargoTemp?.tank1 || '-160.0'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Tank 2:</span>
          </div>
          <span className="font-medium">
            {isLoading ? '...' : vesselData?.cargoTemp?.tank2 || '-160.0'}
          </span>
        </div>
      </div>
    </div>
  );

  // Create content for fuel consumption tooltip
  const fuelConsumptionTooltipContent = (
    <div>
      <div className="mb-2">Fuel Consumption Breakdown:</div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <span>Main Engine:</span>
          </div>
          <span className="font-medium">
            {isLoading ? '...' : vesselData?.consumption?.me.lng || '0'} MT/d
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-400"></div>
            <span>Aux Engine:</span>
          </div>
          <span className="font-medium">
            {isLoading ? '...' : vesselData?.consumption?.ae.lng || '0'} MT/d
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>Boiler:</span>
          </div>
          <span className="font-medium">
            {isLoading ? '...' : vesselData?.consumption?.boiler.lng || '0'}{' '}
            MT/d
          </span>
        </div>
      </div>
    </div>
  );

  // Render the vessel overview with status cards
  return (
    <div className="p-4 bg-[#0F1824]/20 rounded-lg backdrop-blur-sm border border-[#3BADE5]/10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Ship className="text-[#3BADE5] h-6 w-6 mr-2" />
          <div>
            <h2 className="text-white text-lg font-medium">
              {isLoading ? 'Loading...' : vesselData?.name || 'Vessel'}
            </h2>
            <p className="text-gray-400 text-xs">
              {isLoading
                ? '...'
                : `${vesselData?.type || 'DF'} | ${
                    vesselData?.capacity?.toLocaleString() || '0'
                  } m³ | Voyage ${vesselData?.voyageNo || 'N/A'}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium flex items-center">
            <StatusBadge
              status={isLoading ? 'Loading' : vesselData?.status || 'Unknown'}
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">
            {isLoading ? '...' : vesselData?.event || 'At Sea'}
          </p>
        </div>
      </div>

      {/* First row of status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-3">
        <StatusCard
          title="Tank Pressure"
          value={isLoading ? '...' : vesselData?.tankPressure?.avg || '0.000'}
          unit="barg"
          icon={<Gauge size={14} className="text-[#3BADE5]" />}
          trend={vesselData?.tankPressure?.avg > 0.12 ? 'up' : null}
          onClick={(e) => showTooltip(tankPressureTooltipContent, e)}
          isLoading={isLoading}
        />

        <StatusCard
          title="Cargo Temp"
          value={isLoading ? '...' : vesselData?.cargoTemp?.avg || '-160.0'}
          unit="°C"
          icon={<Thermometer size={14} className="text-red-500" />}
          onClick={(e) => showTooltip(tankTempTooltipContent, e)}
          isLoading={isLoading}
        />

        <StatusCard
          title="Cargo Level"
          value={
            isLoading ? '...' : vesselData?.cargoLevel?.percentage || '0.0'
          }
          unit="%"
          icon={<Droplet size={14} className="text-blue-400" />}
          isLoading={isLoading}
        />

        <StatusCard
          title="Engine Load"
          value={isLoading ? '...' : vesselData?.engineData?.load || '0'}
          unit="%"
          icon={<Gauge size={14} className="text-yellow-400" />}
          isLoading={isLoading}
        />

        <StatusCard
          title="LNG Consumption"
          value={isLoading ? '...' : vesselData?.consumption?.total?.lng || '0'}
          unit="MT/d"
          icon={<Fuel size={14} className="text-purple-400" />}
          onClick={(e) => showTooltip(fuelConsumptionTooltipContent, e)}
          isLoading={isLoading}
        />

        <StatusCard
          title="Alerts"
          value={isLoading ? '...' : vesselData?.alerts || '0'}
          icon={<AlertTriangle size={14} className="text-amber-400" />}
          className={vesselData?.alerts > 0 ? 'border border-amber-500/20' : ''}
          isLoading={isLoading}
        />
      </div>

      {/* Second row of status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatusCard
          title="Speed"
          value={isLoading ? '...' : vesselData?.speed || '0'}
          unit="knots"
          icon={<Navigation size={14} className="text-green-400" />}
          isLoading={isLoading}
        />

        <StatusCard
          title="Course"
          value={isLoading ? '...' : vesselData?.course || '0'}
          unit="°"
          icon={<Navigation size={14} className="text-blue-400" />}
          isLoading={isLoading}
        />

        <StatusCard
          title="Weather/BF"
          value={
            isLoading
              ? '...'
              : `${vesselData?.weather || 'Good'}/${vesselData?.bfScale || '0'}`
          }
          icon={<Wind size={14} className="text-indigo-400" />}
          isLoading={isLoading}
        />

        <StatusCard
          title="BOG Rate"
          value={isLoading ? '...' : vesselData?.boilOffRate || '0.00'}
          unit="%/day"
          icon={<Activity size={14} className="text-amber-400" />}
          trend={vesselData?.boilOffRate > 0.09 ? 'up' : 'down'}
          isLoading={isLoading}
        />

        <StatusCard
          title="Ambient Temp"
          value={isLoading ? '...' : vesselData?.temperatures?.ambient || '0'}
          unit="°C"
          icon={<Thermometer size={14} className="text-orange-400" />}
          isLoading={isLoading}
        />

        <StatusCard
          title="Sea Water Temp"
          value={isLoading ? '...' : vesselData?.temperatures?.seaWater || '0'}
          unit="°C"
          icon={<Thermometer size={14} className="text-cyan-400" />}
          isLoading={isLoading}
        />
      </div>

      {/* Tooltip container */}
      {tooltipVisible && tooltipContent && (
        <div
          className="fixed z-50 w-64 p-3 bg-[#132337] rounded-lg shadow-lg border border-[#3BADE5]/20"
          style={{
            top: tooltipPosition.y,
            left: tooltipPosition.x,
          }}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <div className="space-y-2 text-sm">{tooltipContent}</div>
        </div>
      )}
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-blue-500/20 text-blue-400';

  if (status === 'Laden Voyage') {
    bgColor = 'bg-emerald-500/20 text-emerald-400';
  } else if (status === 'Ballast Voyage') {
    bgColor = 'bg-amber-500/20 text-amber-400';
  } else if (status === 'Loading' || status === 'Discharging') {
    bgColor = 'bg-purple-500/20 text-purple-400';
  } else if (status === 'At Anchor') {
    bgColor = 'bg-slate-500/20 text-slate-400';
  } else if (status === 'Loading') {
    bgColor = 'bg-gray-500/20 text-gray-400';
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${bgColor}`}>
      {status}
    </span>
  );
};

export default VesselOverview;
