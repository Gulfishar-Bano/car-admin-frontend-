// src/context/DriverStatusContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
// Assuming your API service is accessible from here
import { getDrivers } from '../../services/api'; // <-- You need to make sure this path is correct

// 1. Create the Context (Unchanged)
const DriverStatusContext = createContext({
    // ...
});

// 2. Create the Provider component (UPDATED)
export const DriverStatusProvider = ({ children }) => {
    const [driverStats, setDriverStats] = useState({
        totalDrivers: 0,
        activeDrivers: 0,
        inactiveDrivers: 0,
    });

    const updateDriverStats = (stats) => {
        setDriverStats(stats);
    };

    // 🌟🌟 NEW LOGIC: Initial Fetch on component mount 🌟🌟
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await getDrivers();
                
                const driversWithStatus = data.map(driver => ({
                    ...driver,
                    isAvailable: driver.isActive !== undefined ? driver.isActive : false,
                }));

                const activeCount = driversWithStatus.filter(d => d.isAvailable).length;
                const totalCount = driversWithStatus.length;
                const inactiveCount = totalCount - activeCount;

                // Update the state immediately after fetch
                updateDriverStats({
                    totalDrivers: totalCount,
                    activeDrivers: activeCount,
                    inactiveDrivers: inactiveCount,
                });

            } catch (error) {
                console.error("Failed to fetch initial driver data:", error);
            }
        };

        fetchInitialData();
    }, []); // Empty dependency array means run once on mount

    return (
        <DriverStatusContext.Provider value={{ ...driverStats, updateDriverStats }}>
            {children}
        </DriverStatusContext.Provider>
    );
};

// 3. Custom Hook (Unchanged)
export const useDriverStatus = () => useContext(DriverStatusContext);