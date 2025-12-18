// src/pages/dashboard/Dashboard.js
import "./Dashboard.css";
import { useDriverStatus } from '../pages/Drivers/DriverStatusContext'; // <-- NEW IMPORT

const Dashboard = () => {
    // 🌟🌟🌟 NEW LOGIC: Get data from Context 🌟🌟🌟
    const { totalDrivers, activeDrivers, inactiveDrivers } = useDriverStatus();

    const driverStats = { // Use a more descriptive object now
        totalDrivers,
        activeDrivers,
        inactiveDrivers,
    };
    // 🌟🌟🌟 END NEW LOGIC 🌟🌟🌟

    return (
        <div className="dashboard-wrapper">
            <h1>Welcome Admin 👋</h1>
            <p>This is your Car Management Admin Panel</p>

            {/* NEW FEATURE: DRIVER STATUS WIDGET */}
            <div className="stats-container">
                <h2>Driver Overview</h2>
                <div className="status-cards-row">

                    {/* Total Card */}
                    <div className="status-card total-card">
                        <h3>Total Drivers</h3>
                        <p className="status-value">{driverStats.totalDrivers}</p>
                    </div>

                    {/* Active Card */}
                    <div className="status-card active-card">
                        <h3>Active (On-Duty)</h3>
                        <p className="status-value">{driverStats.activeDrivers}</p>
                    </div>

                    {/* Inactive Card */}
                    <div className="status-card inactive-card">
                        <h3>Inactive (Off-Duty)</h3>
                        <p className="status-value">{driverStats.inactiveDrivers}</p>
                    </div>

                </div>
            </div>
            {/* ------------------------------------------- */}
        </div>
    );
};

export default Dashboard;