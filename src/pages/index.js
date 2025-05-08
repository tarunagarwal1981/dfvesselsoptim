import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RefreshCw, Calendar, Clock, AlertCircle } from 'lucide-react';

import { useVesselData } from '../hooks/useVesselData';
import Header from '../components/common/Header';
import Loading from '../components/ui/Loading';
import VesselOverview from '../components/dashboard/VesselOverview';
import VoyageInfo from '../components/dashboard/VoyageInfo';
import TankStatusCard from '../components/dashboard/TankStatusCard';
import EngineDataCard from '../components/dashboard/EngineDataCard';
import ConsumptionChart from '../components/dashboard/ConsumptionChart';
import DateRangePicker from '../components/ui/DateRangePicker';

export default function Dashboard() {
  // Date filter states
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'range'
  const [dateFilter, setDateFilter] = useState({
    singleDate: format(new Date(), 'yyyy-MM-dd'),
    startDate: format(
      new Date(new Date().setDate(new Date().getDate() - 7)),
      'yyyy-MM-dd'
    ),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Get data from hook
  const {
    vesselData,
    historicalData,
    isLoading,
    error,
    refreshData,
    fetchDataByDate,
    fetchDataForDateRange,
    getLatestAvailableDate,
    availableDates,
    isDateAvailable,
  } = useVesselData();

  // Local state for filtered data
  const [currentVesselData, setCurrentVesselData] = useState(null);
  const [filteredHistoricalData, setFilteredHistoricalData] = useState([]);
  const [latestAvailableDate, setLatestAvailableDate] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState(null);

  // Handle date filter changes
  const handleDateChange = (value, type) => {
    setDateFilter((prev) => ({ ...prev, [type]: value }));
    setNoDataMessage(null); // Clear any previous no-data message
  };

  // Handle view mode changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setNoDataMessage(null); // Clear any previous no-data message
  };

  // Initial data fetch and latest date check
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get the latest available date
        const latestDate = await getLatestAvailableDate();
        if (latestDate) {
          setLatestAvailableDate(latestDate);

          // Update date filters to use this date
          const formattedLatestDate = format(latestDate, 'yyyy-MM-dd');
          setDateFilter((prev) => ({
            ...prev,
            singleDate: formattedLatestDate,
            endDate: formattedLatestDate,
          }));
        }
      } catch (err) {
        console.error('Failed to get latest date:', err);
      }
    };

    initializeData();
  }, [getLatestAvailableDate]);

  // Handle data fetch based on view mode and date filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (viewMode === 'daily') {
          // Fetch data for single date
          const data = await fetchDataByDate(dateFilter.singleDate);

          if (data) {
            setCurrentVesselData(data);
            setFilteredHistoricalData([data].filter(Boolean));
            setNoDataMessage(null);
          } else {
            // If no data for this date, show message
            setNoDataMessage(`No data available for ${dateFilter.singleDate}`);
            // Keep displaying previous data with reduced opacity
            // instead of setting to null
          }
        } else {
          // Fetch data for date range
          const data = await fetchDataForDateRange(
            dateFilter.startDate,
            dateFilter.endDate
          );

          if (data && data.length > 0) {
            setFilteredHistoricalData(data);
            // Use the most recent data as current
            setCurrentVesselData(data[data.length - 1]);
            setNoDataMessage(null);
          } else {
            setNoDataMessage(
              `No data available between ${dateFilter.startDate} and ${dateFilter.endDate}`
            );
            // Keep previous data instead of setting to null
          }
        }
      } catch (err) {
        console.error('Failed to fetch filtered data:', err);
        setNoDataMessage('Error loading data. Please try again.');
      }
    };

    // Only fetch if we have date filters set
    if (dateFilter.singleDate || (dateFilter.startDate && dateFilter.endDate)) {
      fetchData();
    }
  }, [viewMode, dateFilter, fetchDataByDate, fetchDataForDateRange]);

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      await refreshData();
      setNoDataMessage(null); // Clear any existing message

      // Refresh filtered data based on current view mode
      if (viewMode === 'daily') {
        const data = await fetchDataByDate(dateFilter.singleDate);
        if (data) {
          setCurrentVesselData(data);
          setFilteredHistoricalData([data].filter(Boolean));
        } else {
          setNoDataMessage(`No data available for ${dateFilter.singleDate}`);
        }
      } else {
        const data = await fetchDataForDateRange(
          dateFilter.startDate,
          dateFilter.endDate
        );
        if (data && data.length > 0) {
          setFilteredHistoricalData(data);
          setCurrentVesselData(data[data.length - 1]);
        } else {
          setNoDataMessage(
            `No data available between ${dateFilter.startDate} and ${dateFilter.endDate}`
          );
        }
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setNoDataMessage('Error refreshing data. Please try again.');
    }
  };

  // Loading state when no data is available yet
  if (isLoading && !currentVesselData) {
    return (
      <div className="min-h-screen bg-[#0F1824]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loading size="large" message="Loading vessel data..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentVesselData) {
    return (
      <div className="min-h-screen bg-[#0F1824]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-6 bg-red-900/20 rounded-lg border border-red-500/20 text-center">
            <h2 className="text-xl text-red-400 mb-2">Error Loading Data</h2>
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center mx-auto"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1824]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Header with Date Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-white">Vessel Dashboard</h1>
            <p className="text-gray-400 text-sm">
              DF Vessel Monitoring -{' '}
              {latestAvailableDate
                ? `Latest data from ${format(
                    latestAvailableDate,
                    'dd MMM yyyy'
                  )}`
                : 'Monitor vessel performance and parameters'}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 self-end">
              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 bg-[#3BADE5]/20 hover:bg-[#3BADE5]/30 text-[#3BADE5] rounded-md flex items-center text-sm"
              >
                <RefreshCw size={14} className="mr-1.5" />
                Refresh
              </button>

              <div className="h-6 border-r border-gray-600 mx-2"></div>

              <div className="inline-flex rounded-md overflow-hidden bg-[#132337]">
                <button
                  onClick={() => handleViewModeChange('daily')}
                  className={`px-3 py-1.5 text-xs font-medium flex items-center ${
                    viewMode === 'daily'
                      ? 'bg-[#3BADE5]/20 text-[#3BADE5]'
                      : 'text-gray-400 hover:bg-[#0F1824]/50 hover:text-white'
                  }`}
                >
                  <Clock size={12} className="mr-1.5" />
                  Daily
                </button>
                <button
                  onClick={() => handleViewModeChange('range')}
                  className={`px-3 py-1.5 text-xs font-medium flex items-center ${
                    viewMode === 'range'
                      ? 'bg-[#3BADE5]/20 text-[#3BADE5]'
                      : 'text-gray-400 hover:bg-[#0F1824]/50 hover:text-white'
                  }`}
                >
                  <Calendar size={12} className="mr-1.5" />
                  Date Range
                </button>
              </div>
            </div>

            <DateRangePicker
              mode={viewMode}
              singleDate={dateFilter.singleDate}
              startDate={dateFilter.startDate}
              endDate={dateFilter.endDate}
              onDateChange={handleDateChange}
              onModeChange={handleViewModeChange}
              availableDates={availableDates}
              isDateAvailable={isDateAvailable}
            />
          </div>
        </div>

        {/* No data message */}
        {noDataMessage && (
          <div className="mb-6 p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg flex items-center">
            <AlertCircle className="text-amber-400 mr-2" size={18} />
            <p className="text-amber-400 text-sm">{noDataMessage}</p>
          </div>
        )}

        {/* Vessel Overview Section */}
        <div className="mb-6">
          <VesselOverview
            vesselData={currentVesselData}
            isLoading={isLoading && !currentVesselData}
          />
        </div>

        {/* Voyage and Tank Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <VoyageInfo
            vesselData={currentVesselData}
            isLoading={isLoading && !currentVesselData}
          />

          <TankStatusCard
            vesselData={currentVesselData}
            isLoading={isLoading && !currentVesselData}
          />
        </div>

        {/* Engine Data Section */}
        <div className="mb-6">
          <EngineDataCard
            vesselData={currentVesselData}
            isLoading={isLoading && !currentVesselData}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ConsumptionChart
            data={filteredHistoricalData}
            isLoading={isLoading && filteredHistoricalData.length === 0}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Disclaimer at the bottom */}
        <div className="text-center text-gray-500 text-xs mt-8 pb-4">
          <p>
            DF Vessel Monitoring System - Showing actual data from database.
            Last updated:{' '}
            {isLoading ? 'Loading...' : new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
