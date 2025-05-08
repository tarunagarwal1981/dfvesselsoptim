import React from 'react';
import {
  Anchor,
  Navigation,
  Timer,
  Map,
  Gauge,
  Calendar,
  ArrowRight,
  Compass,
  Waves,
} from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';

const VoyageInfo = ({ vesselData, isLoading = false }) => {
  // Skip rendering if no data is available
  if (!vesselData && !isLoading) {
    return (
      <DashboardCard title="Voyage Information">
        <div className="text-center py-6">
          <p className="text-gray-400">No voyage data available</p>
        </div>
      </DashboardCard>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    // Attempt to format the date
    try {
      return dateString;
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString || 'N/A';
    }
  };

  return (
    <DashboardCard title="Voyage Information" isLoading={isLoading}>
      <div className="space-y-4">
        {/* Voyage Number and Status */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-medium text-base">
              Voyage #{vesselData?.voyageNo || 'N/A'}
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              {vesselData?.status || 'Unknown'} -{' '}
              {vesselData?.event || 'At Sea'}
            </p>
          </div>
          <div className="bg-[#132337] px-3 py-1 rounded-lg">
            <span className="text-[#3BADE5] text-sm font-medium">
              {vesselData?.voyage?.dtg || '0'} NM to go
            </span>
          </div>
        </div>

        {/* Navigation data */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-[#0F1824]/40 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Navigation size={12} className="mr-1" /> Speed/Ordered
            </div>
            <div className="text-white">
              <span className="text-lg font-medium">
                {vesselData?.speed || '0'}
              </span>
              {vesselData?.orderedSpeed && (
                <span className="text-gray-400 text-sm ml-1">
                  / {vesselData.orderedSpeed}
                </span>
              )}
              <span className="text-gray-400 text-xs ml-1">knots</span>
            </div>
          </div>

          <div className="bg-[#0F1824]/40 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Compass size={12} className="mr-1" /> Course
            </div>
            <div className="text-white">
              <span className="text-lg font-medium">
                {vesselData?.course || '0'}
              </span>
              <span className="text-gray-400 text-xs ml-1">°</span>
            </div>
          </div>

          <div className="bg-[#0F1824]/40 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Waves size={12} className="mr-1" /> Weather/BF/Swell
            </div>
            <div className="text-white">
              <span className="text-sm">
                {vesselData?.weather || 'Good'} /{' '}
              </span>
              <span className="text-sm">{vesselData?.bfScale || '0'} / </span>
              <span className="text-sm">{vesselData?.swellHeight || '0'}</span>
              <span className="text-gray-400 text-xs ml-1">m</span>
            </div>
          </div>
        </div>

        {/* Steam hours and distance */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0F1824]/40 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Timer size={12} className="mr-1" /> Steam Hours
            </div>
            <div className="text-white">
              <span className="text-lg font-medium">
                {vesselData?.voyage?.steamHours || '0'}
              </span>
              <span className="text-gray-400 text-xs ml-1">hrs</span>
            </div>
          </div>

          <div className="bg-[#0F1824]/40 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Map size={12} className="mr-1" /> Steamed Distance
            </div>
            <div className="text-white">
              <span className="text-lg font-medium">
                {vesselData?.voyage?.steamedMiles || '0'}
              </span>
              <span className="text-gray-400 text-xs ml-1">NM</span>
            </div>
          </div>

          <div className="bg-[#0F1824]/40 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Gauge size={12} className="mr-1" /> Slip
            </div>
            <div className="text-white">
              <span className="text-lg font-medium">
                {vesselData?.slip || '0'}
              </span>
              <span className="text-gray-400 text-xs ml-1">%</span>
            </div>
          </div>
        </div>

        {/* Port information */}
        <div className="border-t border-[#3BADE5]/10 pt-4">
          <div className="flex justify-between mb-3">
            <h3 className="text-sm text-white font-medium">Port Information</h3>
            {vesselData?.port?.inPort === 'YES' && (
              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                In Port
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {vesselData?.port?.currentPort ? (
              <div className="flex-1 bg-[#0F1824]/40 p-3 rounded-lg">
                <div className="flex items-center text-gray-400 text-xs mb-1">
                  <Anchor size={12} className="mr-1" />
                  {vesselData.port.inPort === 'YES'
                    ? 'Current Port'
                    : 'Last Port'}
                </div>
                <div className="text-white text-sm font-medium">
                  {vesselData.port.currentPort}

                  {vesselData.port.etd && (
                    <div className="flex items-center text-gray-400 text-xs mt-1">
                      <Calendar size={10} className="mr-1" />
                      ETD: {formatDate(vesselData.port.etd)}
                      {vesselData.port.etdTime && ` ${vesselData.port.etdTime}`}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-[#0F1824]/40 p-3 rounded-lg">
                <div className="flex items-center text-gray-400 text-xs mb-1">
                  <Anchor size={12} className="mr-1" /> Last Port
                </div>
                <div className="text-white text-sm">
                  <span className="italic text-gray-400">N/A</span>
                </div>
              </div>
            )}

            <div className="self-center">
              <ArrowRight size={18} className="text-gray-500" />
            </div>

            {vesselData?.port?.nextPort ? (
              <div className="flex-1 bg-[#0F1824]/40 p-3 rounded-lg">
                <div className="flex items-center text-gray-400 text-xs mb-1">
                  <Anchor size={12} className="mr-1" /> Next Port
                </div>
                <div className="text-white text-sm font-medium">
                  {vesselData.port.nextPort}

                  {vesselData.port.eta && (
                    <div className="flex items-center text-gray-400 text-xs mt-1">
                      <Calendar size={10} className="mr-1" />
                      ETA: {formatDate(vesselData.port.eta)}
                      {vesselData.port.etaTime && ` ${vesselData.port.etaTime}`}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-[#0F1824]/40 p-3 rounded-lg">
                <div className="flex items-center text-gray-400 text-xs mb-1">
                  <Anchor size={12} className="mr-1" /> Next Port
                </div>
                <div className="text-white text-sm">
                  <span className="italic text-gray-400">N/A</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default VoyageInfo;
