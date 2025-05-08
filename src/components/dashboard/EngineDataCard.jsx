import React from 'react';
import { Gauge, Timer, Zap, Fuel } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';

const EngineDataCard = ({ vesselData, isLoading = false }) => {
  // Skip rendering if no data is available
  if (!vesselData && !isLoading) {
    return (
      <DashboardCard title="Engine & Machinery">
        <div className="text-center py-6">
          <p className="text-gray-400">No engine data available</p>
        </div>
      </DashboardCard>
    );
  }

  // Helper function to determine mode display
  const getOperationModeText = (mode) => {
    if (!mode) return 'N/A';

    if (mode === 'YES') return 'On';
    if (mode === 'NO') return 'Off';

    return mode;
  };

  return (
    <DashboardCard title="Engine & Machinery" isLoading={isLoading}>
      <div className="space-y-4">
        {/* Main Engine Section */}
        <div className="bg-[#0F1824]/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Main Engine</h3>
            <div className="px-2 py-0.5 rounded-full text-xs bg-[#3BADE5]/20 text-[#3BADE5]">
              {getOperationModeText(vesselData?.operationMode?.me?.gas) === 'On'
                ? 'Gas Mode'
                : 'LSMGO Mode'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Engine Load */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Gauge size={12} className="text-yellow-400 mr-1" /> Load
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.engineData?.load || '0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">%</span>
              </div>
            </div>

            {/* RPM */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Gauge size={12} className="text-cyan-400 mr-1" /> RPM
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.engineData?.rpm || '0'}
                </span>
              </div>
            </div>

            {/* Run Hours */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Timer size={12} className="text-green-400 mr-1" /> Run Hours
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {Math.round(
                    parseFloat(vesselData?.runHours?.me || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Consumption */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Fuel size={12} className="text-purple-400 mr-1" /> Consumption
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.consumption?.me?.lng || '0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">MT/d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auxiliary Engines Section */}
        <div className="bg-[#0F1824]/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">
              Auxiliary Engines
            </h3>
            <div className="px-2 py-0.5 rounded-full text-xs bg-[#3BADE5]/20 text-[#3BADE5]">
              {getOperationModeText(vesselData?.operationMode?.ae?.gas) === 'On'
                ? 'Gas Mode'
                : 'LSMGO Mode'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* AE1 Load */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Zap size={12} className="text-blue-400 mr-1" /> AE1 Load
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.aeLoad?.ae1 || '0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">kW</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {vesselData?.runHours?.ae1
                  ? `${Math.round(
                      vesselData.runHours.ae1
                    ).toLocaleString()} hrs`
                  : '0 hrs'}
              </div>
            </div>

            {/* AE2 Load */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Zap size={12} className="text-blue-400 mr-1" /> AE2 Load
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.aeLoad?.ae2 || '0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">kW</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {vesselData?.runHours?.ae2
                  ? `${Math.round(
                      vesselData.runHours.ae2
                    ).toLocaleString()} hrs`
                  : '0 hrs'}
              </div>
            </div>

            {/* AE3 Load */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Zap size={12} className="text-blue-400 mr-1" /> AE3 Load
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.aeLoad?.ae3 || '0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">kW</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {vesselData?.runHours?.ae3
                  ? `${Math.round(
                      vesselData.runHours.ae3
                    ).toLocaleString()} hrs`
                  : '0 hrs'}
              </div>
            </div>
          </div>
        </div>

        {/* Boiler & Other Systems */}
        <div className="bg-[#0F1824]/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">
              Boiler & Other Systems
            </h3>
            <div className="px-2 py-0.5 rounded-full text-xs bg-[#3BADE5]/20 text-[#3BADE5]">
              {getOperationModeText(vesselData?.operationMode?.blr?.gas) ===
              'On'
                ? 'Gas Mode'
                : 'LSMGO Mode'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Boiler Consumption */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Fuel size={12} className="text-yellow-400 mr-1" /> Boiler
                Consumption
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.consumption?.boiler?.lng || '0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">MT/d</span>
              </div>
            </div>

            {/* Plant Run Hours */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Timer size={12} className="text-teal-400 mr-1" /> BOG
                Management
              </div>
              <div className="text-white text-sm">
                <div className="flex justify-between items-center">
                  <span>Reliq:</span>
                  <span>
                    {Math.round(
                      parseFloat(vesselData?.runHours?.reliqRunHours || 0)
                    ).toLocaleString()}{' '}
                    hrs
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>GCU:</span>
                  <span>
                    {Math.round(
                      parseFloat(vesselData?.runHours?.gcuRunHours || 0)
                    ).toLocaleString()}{' '}
                    hrs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default EngineDataCard;
