import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api'; // You'll create this endpoint
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    fares: 0,
    currentMarkup: 0,
    systemStatus: 'Online'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, Admin 🚀</h1>
          <p>Here’s what’s happening with Carisma today.</p>
        </div>
        <div className="system-badge">
          <span className="pulse-dot"></span> System {stats.systemStatus}
        </div>
      </header>

      {/* --- STAT CARDS --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bookings">📅</div>
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <p className="stat-number">{stats.bookings}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <h3>Active Markup</h3>
            <p className="stat-number">{stats.currentMarkup}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-content">
        {/* --- UNIQUE FEATURE: ROUTE ANALYTICS --- */}
        <div className="content-card analytics">
          <h3>📈 Top Performing Routes</h3>
          <div className="route-list">
            <div className="route-item">
              <span>Bangalore → Mysore</span>
              <div className="progress-bar"><div className="fill" style={{width: '85%'}}></div></div>
            </div>
            <div className="route-item">
              <span>Bangalore → Ramanagaram</span>
              <div className="progress-bar"><div className="fill" style={{width: '60%'}}></div></div>
            </div>
          </div>
        </div>

        {/* --- UNIQUE FEATURE: ACTIVITY FEED --- */}
        <div className="content-card activity">
          <h3>🔔 Recent Activity</h3>
          <div className="feed-items">
            <div className="feed-item">
              <span className="time">Just now</span>
              <p>New booking confirmed for <strong>Innova Crysta</strong></p>
            </div>
            <div className="feed-item">
              <span className="time">15 mins ago</span>
              <p>Markup updated to <strong>{stats.currentMarkup}%</strong></p>
            </div>
            <div className="feed-item">
              <span className="time">1 hour ago</span>
              <p>User <strong>Pallavi</strong> was promoted to Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;