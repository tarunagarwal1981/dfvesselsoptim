import React from 'react';
import { Thermometer, Gauge, Droplet } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';

const TankStatusCard = ({ vesselData, isLoading = false }) => {
  // Skip rendering if no data is available
  if (!vesselData && !isLoading) {
    return (
      <DashboardCard title="Tank Status">
        <div className="text-center py-6">
          <p className="text-gray-400">No tank data available</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Tank Status" isLoading={isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tank 1 */}
        <div className="bg-[#0F1824]/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Tank 1 (Stb'd)</h3>
            <div className="text-xs text-gray-400">
              {Math.round(
                parseFloat(vesselData?.cargoQty?.tank1 || 0)
              ).toLocaleString()}{' '}
              m³
            </div>
          </div>

          {/* Tank 1 indicators */}
          <div className="grid grid-cols-3 gap-3">
            {/* Temperature */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Thermometer size={12} className="text-red-400 mr-1" />{' '}
                Temperature
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.cargoTemp?.tank1 || '-160.0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">°C</span>
              </div>
            </div>

            {/* Pressure */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Gauge size={12} className="text-blue-400 mr-1" /> Pressure
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.tankPressure?.tank1 || '0.000'}
                </span>
                <span className="text-gray-400 text-xs ml-1">barg</span>
              </div>
            </div>

            {/* Level */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Droplet size={12} className="text-blue-400 mr-1" /> Level
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.cargoLevel?.tank1Level || '0.0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">%</span>
              </div>
            </div>
          </div>

          {/* Level indicator */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <div className="h-4 w-full bg-[#1E293B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-800 to-blue-500 rounded-full"
                style={{
                  width: isLoading
                    ? '0%'
                    : `${Math.min(
                        100,
                        Math.max(
                          0,
                          parseFloat(vesselData?.cargoLevel?.tank1Level || 0)
                        )
                      )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tank 2 */}
        <div className="bg-[#0F1824]/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Tank 2 (Port)</h3>
            <div className="text-xs text-gray-400">
              {Math.round(
                parseFloat(vesselData?.cargoQty?.tank2 || 0)
              ).toLocaleString()}{' '}
              m³
            </div>
          </div>

          {/* Tank 2 indicators */}
          <div className="grid grid-cols-3 gap-3">
            {/* Temperature */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Thermometer size={12} className="text-red-400 mr-1" />{' '}
                Temperature
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.cargoTemp?.tank2 || '-160.0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">°C</span>
              </div>
            </div>

            {/* Pressure */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Gauge size={12} className="text-blue-400 mr-1" /> Pressure
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.tankPressure?.tank2 || '0.000'}
                </span>
                <span className="text-gray-400 text-xs ml-1">barg</span>
              </div>
            </div>

            {/* Level */}
            <div className="flex flex-col bg-[#132337]/50 p-3 rounded-lg">
              <div className="flex items-center text-gray-400 text-xs mb-1">
                <Droplet size={12} className="text-blue-400 mr-1" /> Level
              </div>
              <div className="text-white">
                <span className="text-base font-medium">
                  {vesselData?.cargoLevel?.tank2Level || '0.0'}
                </span>
                <span className="text-gray-400 text-xs ml-1">%</span>
              </div>
            </div>
          </div>

          {/* Level indicator */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <div className="h-4 w-full bg-[#1E293B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-800 to-blue-500 rounded-full"
                style={{
                  width: isLoading
                    ? '0%'
                    : `${Math.min(
                        100,
                        Math.max(
                          0,
                          parseFloat(vesselData?.cargoLevel?.tank2Level || 0)
                        )
                      )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tank comparison and totals */}
      <div className="mt-4 bg-[#0F1824]/40 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Cargo Summary</h3>
          <div className="text-sm text-white font-medium">
            {Math.round(
              parseFloat(vesselData?.cargoQty?.total || 0)
            ).toLocaleString()}{' '}
            m³
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cargo quantity comparison */}
          <div>
            <div className="text-xs text-gray-400 mb-2">Cargo Distribution</div>
            <div className="h-5 w-full bg-[#1E293B] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-600 rounded-l-full"
                style={{
                  width: isLoading
                    ? '50%'
                    : `${
                        (parseFloat(vesselData?.cargoQty?.tank1 || 0) /
                          parseFloat(vesselData?.cargoQty?.total || 1)) *
                        100
                      }%`,
                }}
              >
                <span className="text-xs text-white px-2 py-1">Tank 1</span>
              </div>
              <div
                className="h-full bg-blue-500 rounded-r-full"
                style={{
                  width: isLoading
                    ? '50%'
                    : `${
                        (parseFloat(vesselData?.cargoQty?.tank2 || 0) /
                          parseFloat(vesselData?.cargoQty?.total || 1)) *
                        100
                      }%`,
                }}
              >
                <span className="text-xs text-white px-2 py-1">Tank 2</span>
              </div>
            </div>
          </div>

          {/* Total capacity usage */}
          <div>
            <div className="text-xs text-gray-400 mb-2">
              Total Capacity Usage:{' '}
              {vesselData?.cargoLevel?.percentage || '0.0'}%
            </div>
            <div className="h-5 w-full bg-[#1E293B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-800 to-blue-500 rounded-full"
                style={{
                  width: isLoading
                    ? '0%'
                    : `${Math.min(
                        100,
                        Math.max(
                          0,
                          parseFloat(vesselData?.cargoLevel?.percentage || 0)
                        )
                      )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default TankStatusCard;
