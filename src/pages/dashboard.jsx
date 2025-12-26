import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, YAxis } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  // Initialize with empty arrays to prevent .map() errors before data loads
  const [data, setData] = useState({
    stats: [],
    routes: [],
    activities: [],
    systemStatus: 'Offline'
  });
  const [loading, setLoading] = useState(true);
  
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Ensure this URL matches your backend port
        const response = await axios.get(`${BASE_URL}/jwt-auth/dashboard`);
        setData(response.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loader">Loading Carisma Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, Admin 🚀</h1>
          <p>Here’s what’s happening with Carisma today.</p>
        </div>
        <div className="system-badge">
          <span className="pulse-dot"></span> System {data.systemStatus || 'Online'}
        </div>
      </header>

      {/* --- STAT CARDS (Dynamic) --- */}
      <div className="stats-grid">
        {data.stats?.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ background: `${stat.color}22`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <p className="stat-number">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-content">
        {/* --- ROUTE ANALYTICS (Recharts) --- */}
        <div className="content-card analytics">
          <h3>📈 Top Performing Routes</h3>
          <div className="chart-wrapper" style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={data.routes}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                  {data.routes?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- ACTIVITY FEED (Using your formatTimeAgo logic) --- */}
        <div className="content-card activity">
          <h3>🔔 Recent Activity</h3>
          <div className="feed-items">
            {data.activities?.map((item) => (
              <div className="feed-item" key={item.id}>
                <div className={`type-indicator ${item.type}`}></div>
                <div className="feed-content">
                  <p>{item.text}</p>
                  <span className="time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;