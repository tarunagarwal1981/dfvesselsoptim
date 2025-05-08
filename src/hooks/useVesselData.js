import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabase';

export const useVesselData = () => {
  const [fleetData, setFleetData] = useState([]);
  const [vesselData, setVesselData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const dataLastFetched = useRef(null);
  const activeRequests = useRef(0);
  const maxConcurrentRequests = 2; // Limit concurrent requests
  const requestQueue = useRef([]);
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const dataCacheRef = useRef({
    current: null,
    byDate: {},
    dateRanges: {},
    historical: [],
  });

  // Constants for vessel information
  const VESSEL_NAME = 'MV CryoMaster';
  const VESSEL_TYPE = 'MEGI';
  const VESSEL_CAPACITY = 170000; // in cubic meters

  // Helper function to format dates for DB query (JS Date -> DD-MM-YYYY)
  const formatDateForQuery = (date) => {
    try {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`; // Format as DD-MM-YYYY to match your DB
    } catch (err) {
      console.error('Date formatting error:', err);
      // Return today's date in correct format as fallback
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    }
  };

  // Helper function to parse database date format (DD-MM-YYYY -> JS Date)
  const parseDatabaseDate = (dateStr) => {
    if (!dateStr) return new Date();

    try {
      // Handle DD-MM-YYYY format
      const [day, month, year] = dateStr
        .split('-')
        .map((num) => parseInt(num, 10));
      return new Date(year, month - 1, day);
    } catch (err) {
      console.error('Date parsing error:', err);
      return new Date(); // Return today as fallback
    }
  };

  // Convert JS Date to YYYY-MM-DD string format for internal use
  const formatDateForInternal = (date) => {
    try {
      return date.toISOString().split('T')[0];
    } catch (err) {
      console.error('Internal date formatting error:', err);
      return new Date().toISOString().split('T')[0]; // Today as fallback
    }
  };

  // Request handler - manages a queue to prevent too many concurrent requests
  const processRequestQueue = useCallback(async () => {
    if (
      requestQueue.current.length === 0 ||
      activeRequests.current >= maxConcurrentRequests ||
      fetchInProgress
    ) {
      return;
    }

    setFetchInProgress(true);

    try {
      activeRequests.current += 1;
      const nextRequest = requestQueue.current.shift();
      await nextRequest();
    } catch (err) {
      console.error('Error processing request queue:', err);
    } finally {
      activeRequests.current -= 1;
      setFetchInProgress(false);

      // Process next request if there are more in the queue
      if (requestQueue.current.length > 0) {
        setTimeout(() => {
          processRequestQueue();
        }, 300); // Add a small delay between requests
      }
    }
  }, [fetchInProgress]);

  // Add request to queue
  const queueRequest = useCallback(
    (requestFn) => {
      return new Promise((resolve) => {
        const wrappedRequest = async () => {
          try {
            const result = await requestFn();
            resolve(result);
          } catch (err) {
            console.error('Request failed:', err);
            resolve(null);
          }
        };

        requestQueue.current.push(wrappedRequest);
        processRequestQueue();
      });
    },
    [processRequestQueue]
  );

  // Format Supabase data to match component structure
  const formatVesselData = useCallback(
    (data) => {
      if (!data) return null;

      try {
        // Parse date from DD-MM-YYYY format to JS Date
        const dateObj = parseDatabaseDate(data.DATE);

        // Convert to YYYY-MM-DD for internal use
        const formattedDate = formatDateForInternal(dateObj);

        // Extract tank pressure values and convert to the required format
        const tank1Pressure = parseFloat(
          data["No.1_LNG_tank(Stb'd)_Pressure(Mpa)"] || 0.08
        ).toFixed(3);
        const tank2Pressure = parseFloat(
          data['No.2_LNG_tank(Port)_level_mmPressure(Mpa)'] || 0.08
        ).toFixed(3);

        // Calculate average pressure
        const avgPressure = (
          (parseFloat(tank1Pressure) + parseFloat(tank2Pressure)) /
          2
        ).toFixed(3);

        // Extract tank temperature values
        const tank1Temp = parseFloat(
          data["No.1_LNG_tank(Stb'd)_AvgTemp"] || -160
        ).toFixed(1);
        const tank2Temp = parseFloat(
          data['No.2_LNG_tank(Port)_level_mmAvg_Temp'] || -160
        ).toFixed(1);

        // Calculate average temperature
        const avgTemp = (
          (parseFloat(tank1Temp) + parseFloat(tank2Temp)) /
          2
        ).toFixed(1);

        // Calculate cargo levels
        const cargoQuantity = parseFloat(data.CARGO_ONBOARDQUANTITY || 0);
        const cargoLevelPercentage = (
          (cargoQuantity / VESSEL_CAPACITY) *
          100
        ).toFixed(1);

        // Fixed BOG calculations instead of random values
        const bogRate = 0.08 + Math.min(parseFloat(avgPressure) * 0.1, 0.02);
        const nbogRate = Math.round(bogRate * 100 * 8); // Simplified NBOG calculation

        // Calculate fuel consumption values
        const gasFuelConsumption = parseFloat(data.TOTAL_BUNKER_CONS_LNG || 0);
        const liquidFuelConsumption = parseFloat(
          data.TOTAL_BUNKER_CONS_LSMGO || 0
        );

        // Set CP Compliance based on actual parameters
        const cpCompliant =
          parseFloat(data.BF || 0) < 5 && parseFloat(data['SWELL(M)'] || 0) < 3;

        // Map data to the expected dashboard structure - using "N/A" for missing values
        return {
          id: data.id || `V${1000}`,
          name: data.vessel_name || VESSEL_NAME,
          type: VESSEL_TYPE,
          capacity: VESSEL_CAPACITY,
          voyageNo: data['VOYAGE_NO.'] || 'N/A',
          status: data.Laden_condition || 'N/A',
          event: data.Event || 'N/A',
          bogRate: parseFloat(bogRate.toFixed(3)),
          nbogRate: nbogRate,
          speed: parseFloat(data.AVG_SPEED || 0),
          orderedSpeed: parseFloat(data.ORDERED_SPEED || 0),
          course: parseFloat(data.COURSE || 0),
          weather: data.WEATHER || 'N/A',
          bfScale: parseFloat(data.BF || 0),
          swellHeight: parseFloat(data['SWELL(M)'] || data.Swell_ht || 0),
          slip: parseFloat(data.SLIP || 0),
          cpCompliant: cpCompliant,
          tankPressure: {
            tank1: tank1Pressure,
            tank2: tank2Pressure,
            avg: avgPressure,
          },
          cargoTemp: {
            tank1: tank1Temp,
            tank2: tank2Temp,
            avg: avgTemp,
          },
          cargoQty: {
            tank1: parseFloat(data["No.1_LNG_tank(Stb'd)"] || 0),
            tank2: parseFloat(data['No.2_LNG_tank(Port)_level_mm'] || 0),
            total: cargoQuantity,
          },
          cargoLevel: {
            percentage: cargoLevelPercentage,
            tank1Level: (
              (parseFloat(data["No.1_LNG_tank(Stb'd)"] || 0) /
                (VESSEL_CAPACITY / 2)) *
              100
            ).toFixed(1),
            tank2Level: (
              (parseFloat(data['No.2_LNG_tank(Port)_level_mm'] || 0) /
                (VESSEL_CAPACITY / 2)) *
              100
            ).toFixed(1),
          },
          draft: {
            forward: parseFloat(data.DRAFT_fwd || 0),
            aft: parseFloat(data.Draft_Aft || 0),
          },
          fuelConsumption: {
            gas: gasFuelConsumption,
            liquid: liquidFuelConsumption,
          },
          engineData: {
            load: parseFloat(data['M/E_AVE._LOAD'] || 0),
            rpm: parseFloat(data['M/ERPM'] || 0),
          },
          consumption: {
            me: {
              lng: parseFloat(data['M/E_CONS_LNG'] || 0),
              lsmgo: parseFloat(data['M/E_CONS_LSMGO'] || 0),
            },
            ae: {
              lng: parseFloat(data['A/E_CONS_LNG'] || 0),
              lsmgo: parseFloat(data['A/E_CONS_LSMGO'] || 0),
            },
            boiler: {
              lng:
                parseFloat(data['COMP_BLR_CONS_LNG'] || 0) +
                parseFloat(data['AUX_BLR_CONS_LNG'] || 0),
              lsmgo:
                parseFloat(data['COMP_BLR_CONS_LSMGO'] || 0) +
                parseFloat(data['AUX_BLR_CONS_LSMGO'] || 0),
            },
            total: {
              lng: parseFloat(data['TOTAL_BUNKER_CONS_LNG'] || 0),
              lsmgo: parseFloat(data['TOTAL_BUNKER_CONS_LSMGO'] || 0),
            },
          },
          bunkerRob: {
            lng: parseFloat(data['BUNKER_ROB_LNG_t'] || 0),
            lsmgo: parseFloat(data['BUNKER_ROB_LSMGO'] || 0),
          },
          operationMode: {
            me: {
              gas: data['ME_operation_mode_Gas'] || 'N/A',
              lsmgo: data['ME_operation_mode_LSMGO/LSFO'] || 'N/A',
            },
            ae: {
              gas: data['AE_operation_mode_Gas'] || 'N/A',
              lsmgo: data['AE_operation_mode_LSMGO/LSFO'] || 'N/A',
            },
            blr: {
              gas: data['BLR_operation_mode_Gas'] || 'N/A',
              lsmgo: data['BLR_operation_mode_LSMGO/LSFO'] || 'N/A',
            },
          },
          runHours: {
            me: parseFloat(data.MAIN_ENGINE_RUN_HOURS || 0),
            ae1: parseFloat(data.AUX_ENGINE_RUN_HOURS_1 || 0),
            ae2: parseFloat(data.AUX_ENGINE_RUN_HOURS_2 || 0),
            ae3: parseFloat(data.AUX_ENGINE_RUN_HOURS_3 || 0),
            reliqRunHours: parseFloat(data.RELIQ_RUN_HOURS || 0),
            gcuRunHours: parseFloat(data.GCU_RUN_HOURS || 0),
          },
          aeLoad: {
            ae1: parseFloat(data['AUX._ENGINEAVE._LOAD_(KW)_1'] || 0),
            ae2: parseFloat(data['AUX._ENGINEAVE._LOAD_(KW)_2'] || 0),
            ae3: parseFloat(data['AUX._ENGINEAVE._LOAD_(KW)_3'] || 0),
          },
          voyage: {
            steamHours: parseFloat(data.STEAM_HOUR || 0),
            steamedMiles: parseFloat(data.STEAMED_MILE || 0),
            engineMiles: parseFloat(data.ENGINE_MILE || 0),
            dtg: parseFloat(data.DTG || 0),
          },
          temperatures: {
            ambient: parseFloat(data.Ambient_Air || 0),
            seaWater: parseFloat(data.Sea_Water || 0),
          },
          position: {
            lat: parseFloat(data.Lat || 0),
            long: parseFloat(data.long || 0),
          },
          port: {
            inPort: data['IN_PORT_(ONLY_IN_PORT)'] || 'NO',
            currentPort: data.In_Port_name || 'N/A',
            etb: data['ETB_(Date_/_Time)(ONLY_AVAILABLE)'] || 'N/A',
            etbTime: data.ETB_time || 'N/A',
            etd: data['ETD_(Date_/_Time)(ONLY_AVAILABLE)'] || 'N/A',
            etdTime: data.ETD_time || 'N/A',
            nextPort: data.Next_portname || 'N/A',
            eta: data['ETA_(Date_/_Time)'] || 'N/A',
            etaTime: data.ETA_time || 'N/A',
          },
          // Additional calculated fields
          boilOffRate: parseFloat(bogRate.toFixed(3)),
          meConsumption: parseFloat(data['M/E_CONS_LNG'] || 0),
          aeConsumption: parseFloat(data['A/E_CONS_LNG'] || 0),
          boilerConsumption:
            parseFloat(data['COMP_BLR_CONS_LNG'] || 0) +
            parseFloat(data['AUX_BLR_CONS_LNG'] || 0),
          totalConsumption: parseFloat(data['TOTAL_BUNKER_CONS_LNG'] || 0),
          // Special field for internal date tracking
          date: formattedDate,
          time: data.TIME || '00:00',
          timeZone: data.TIME_ZONE || 'UTC',
          bogConsumption: parseFloat(data['TOTAL_BUNKER_CONS_LNG'] || 0),
          alerts: parseInt(data.alerts || 0),
        };
      } catch (err) {
        console.error('Error formatting vessel data:', err);
        return null;
      }
    },
    [
      VESSEL_CAPACITY,
      VESSEL_NAME,
      VESSEL_TYPE,
      parseDatabaseDate,
      formatDateForInternal,
    ]
  );

  // Fetch all available dates for the calendar
  const fetchAvailableDates = useCallback(async () => {
    try {
      // Fetch all date records with a timeout
      const fetchPromise = supabase
        .from('pacific_garnet')
        .select('DATE')
        .order('DATE', { ascending: false });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Available dates request timed out')),
          10000
        );
      });

      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise,
      ]);

      if (error) throw error;

      if (data && data.length > 0) {
        // Convert DB dates to YYYY-MM-DD format
        const dates = data.map((item) => {
          const dateObj = parseDatabaseDate(item.DATE);
          return formatDateForInternal(dateObj);
        });

        setAvailableDates(dates);
        return dates;
      }
      return [];
    } catch (err) {
      console.error('Error fetching available dates:', err);
      return [];
    }
  }, [parseDatabaseDate, formatDateForInternal]);

  // Check if a specific date has data available
  const isDateAvailable = useCallback(
    (dateStr) => {
      return availableDates.includes(dateStr);
    },
    [availableDates]
  );

  // Get the latest available date
  const getLatestAvailableDate = useCallback(async () => {
    try {
      // Fetch most recent date with a timeout
      const fetchPromise = supabase
        .from('pacific_garnet')
        .select('DATE')
        .order('DATE', { ascending: false })
        .limit(1);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Latest date request timed out')),
          5000
        );
      });

      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise,
      ]);

      if (error) throw error;

      if (data && data.length > 0) {
        return parseDatabaseDate(data[0].DATE);
      }

      return new Date(); // Fallback to today if no dates found
    } catch (err) {
      console.error('Error getting latest date:', err);
      return new Date(); // Fallback to today
    }
  }, [parseDatabaseDate]);

  // Fetch current vessel data with improved error handling and data caching
  const fetchCurrentVesselData = useCallback(async () => {
    // Skip if we've fetched data recently (within 5 minutes)
    const now = new Date();
    if (dataLastFetched.current && now - dataLastFetched.current < 300000) {
      console.log('Using cached data - last fetched:', dataLastFetched.current);
      return dataCacheRef.current.current; // Return cached data
    }

    return queueRequest(async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the most recent vessel data entry with a timeout
        const fetchPromise = supabase
          .from('pacific_garnet')
          .select('*')
          .order('DATE', { ascending: false })
          .limit(1);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('Database request timed out')),
            10000
          );
        });

        const { data, error } = await Promise.race([
          fetchPromise,
          timeoutPromise,
        ]);

        if (error) throw error;

        console.log('Current vessel data:', data);

        if (data && data.length > 0) {
          // Format data to match the expected structure in your components
          const formattedData = formatVesselData(data[0]);

          if (formattedData) {
            setVesselData(formattedData);
            // Also add to fleet data since we only have one vessel for now
            setFleetData([formattedData]);

            // Cache the data
            dataCacheRef.current.current = formattedData;
            dataLastFetched.current = now;

            return formattedData;
          } else {
            throw new Error('Failed to format vessel data');
          }
        } else {
          throw new Error('No vessel data found in the database');
        }
      } catch (err) {
        console.error('Error fetching current vessel data:', err);
        setError(err.message);
        return null; // Return null instead of throwing error to handle gracefully
      } finally {
        setIsLoading(false);
      }
    });
  }, [formatVesselData, queueRequest]);

  // Fetch historical vessel data
  const fetchHistoricalData = useCallback(
    async (days = 30) => {
      // Check if we already have this data in cache
      if (dataCacheRef.current.historical.length > 0) {
        return dataCacheRef.current.historical;
      }

      return queueRequest(async () => {
        try {
          setIsLoading(true);
          setError(null);

          // Find the most recent data first to calculate the date range from there
          const recentDataPromise = supabase
            .from('pacific_garnet')
            .select('DATE')
            .order('DATE', { ascending: false })
            .limit(1);

          const recentTimeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error('Recent data request timed out')),
              5000
            );
          });

          const { data: recentData, error: recentError } = await Promise.race([
            recentDataPromise,
            recentTimeoutPromise,
          ]);

          if (recentError) throw recentError;

          if (!recentData || recentData.length === 0) {
            throw new Error(
              'Could not find recent data to determine date range'
            );
          }

          // Get the most recent date in the database
          const mostRecentDate = parseDatabaseDate(recentData[0].DATE);

          // Calculate date range - going back the specified number of days from the most recent date
          const endDate = new Date(mostRecentDate);
          const startDate = new Date(mostRecentDate);
          startDate.setDate(startDate.getDate() - days);

          // Format dates for SQL query
          const formattedEndDate = formatDateForQuery(endDate);
          const formattedStartDate = formatDateForQuery(startDate);

          console.log(
            `Fetching data from ${formattedStartDate} to ${formattedEndDate}`
          );

          // Fetch historical data with timeout
          const fetchPromise = supabase
            .from('pacific_garnet')
            .select('*')
            .gte('DATE', formattedStartDate)
            .lte('DATE', formattedEndDate)
            .order('DATE', { ascending: true });

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error('Historical data request timed out')),
              15000
            );
          });

          const { data, error } = await Promise.race([
            fetchPromise,
            timeoutPromise,
          ]);

          if (error) throw error;

          console.log(`Historical data count: ${data?.length || 0}`);

          if (data && data.length > 0) {
            const formattedData = data
              .map((entry) => formatVesselData(entry))
              .filter(Boolean);
            setHistoricalData(formattedData);

            // Cache the historical data
            dataCacheRef.current.historical = formattedData;

            return formattedData;
          } else {
            throw new Error('No historical data found');
          }
        } catch (err) {
          console.error('Error fetching historical vessel data:', err);
          setError(err.message);
          return []; // Return empty array instead of throwing error
        } finally {
          setIsLoading(false);
        }
      });
    },
    [formatVesselData, queueRequest, formatDateForQuery, parseDatabaseDate]
  );

  // Function to fetch data for specific date range with caching
  const fetchDataForDateRange = useCallback(
    async (startDate, endDate) => {
      // Generate a cache key for this date range
      const cacheKey = `${startDate}_${endDate}`;

      // Check if we have this date range in cache
      if (dataCacheRef.current.dateRanges[cacheKey]) {
        return dataCacheRef.current.dateRanges[cacheKey];
      }

      return queueRequest(async () => {
        try {
          setIsLoading(true);
          setError(null);

          // Convert JS Date objects to DD-MM-YYYY strings for Supabase query
          const formattedStartDate = formatDateForQuery(new Date(startDate));
          const formattedEndDate = formatDateForQuery(new Date(endDate));

          console.log(
            `Fetching date range: ${formattedStartDate} to ${formattedEndDate}`
          );

          // Fetch data with timeout
          const fetchPromise = supabase
            .from('pacific_garnet')
            .select('*')
            .gte('DATE', formattedStartDate)
            .lte('DATE', formattedEndDate)
            .order('DATE', { ascending: true });

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error('Date range request timed out')),
              15000
            );
          });

          const { data, error } = await Promise.race([
            fetchPromise,
            timeoutPromise,
          ]);

          if (error) throw error;

          console.log(`Date range query returned ${data?.length || 0} records`);

          if (data && data.length > 0) {
            const formattedData = data
              .map((entry) => formatVesselData(entry))
              .filter(Boolean);

            // Cache the date range data
            dataCacheRef.current.dateRanges[cacheKey] = formattedData;

            return formattedData;
          } else {
            return []; // Return empty array if no data found
          }
        } catch (err) {
          console.error('Error fetching data for date range:', err);
          setError(err.message);
          return []; // Return empty array instead of throwing error
        } finally {
          setIsLoading(false);
        }
      });
    },
    [formatVesselData, formatDateForQuery, queueRequest]
  );

  // Fetch data by date with caching
  const fetchDataByDate = useCallback(
    async (date) => {
      // Check if we have this date in cache
      if (dataCacheRef.current.byDate[date]) {
        return dataCacheRef.current.byDate[date];
      }

      return queueRequest(async () => {
        try {
          setIsLoading(true);
          setError(null);

          // Convert to DD-MM-YYYY format for DB query
          const formattedDate = formatDateForQuery(new Date(date));

          console.log(`Fetching data for specific date: ${formattedDate}`);

          // Fetch data with timeout
          const fetchPromise = supabase
            .from('pacific_garnet')
            .select('*')
            .eq('DATE', formattedDate);

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Date request timed out')), 8000);
          });

          const { data, error } = await Promise.race([
            fetchPromise,
            timeoutPromise,
          ]);

          if (error) throw error;

          console.log(
            `Found ${data?.length || 0} records for date ${formattedDate}`
          );

          if (data && data.length > 0) {
            const formattedData = formatVesselData(data[0]);

            // Cache the data
            dataCacheRef.current.byDate[date] = formattedData;

            return formattedData;
          } else {
            console.log(`No data found for requested date: ${date}`);
            return null; // Return null instead of trying to get fallback data
          }
        } catch (err) {
          console.error('Error fetching data by date:', err);
          setError(err.message);
          return null;
        } finally {
          setIsLoading(false);
        }
      });
    },
    [formatVesselData, formatDateForQuery, queueRequest]
  );

  // Initialize data fetch on component mount
  useEffect(() => {
    // Set up one-time initial data fetch
    const initializeData = async () => {
      try {
        await fetchAvailableDates(); // Get available dates first
        await fetchCurrentVesselData();
        await fetchHistoricalData(30); // Fetch 30 days of historical data
      } catch (err) {
        console.error('Failed to initialize data:', err);
      }
    };

    initializeData();

    // Set up polling for real-time updates at a much lower frequency
    const intervalId = setInterval(() => {
      fetchCurrentVesselData().catch((err) => {
        console.error('Periodic data fetch failed:', err);
      });
    }, 600000); // Refresh every 10 minutes

    return () => {
      clearInterval(intervalId);
      // Clear request queue on unmount
      requestQueue.current = [];
    };
  }, [fetchCurrentVesselData, fetchHistoricalData, fetchAvailableDates]);

  return {
    fleetData,
    vesselData,
    historicalData,
    isLoading,
    error,
    availableDates,
    isDateAvailable,
    refreshData: fetchCurrentVesselData,
    fetchHistoricalData,
    fetchDataForDateRange,
    fetchDataByDate,
    getLatestAvailableDate,
  };
};
