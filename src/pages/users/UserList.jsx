import React, { useState, useEffect } from 'react';
import { getUsers, toggleUserStatus } from '../../services/api';
import './User.css';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    if(window.confirm("Are you sure you want to change this user's status?")) {
      await toggleUserStatus(id);
      fetchUsers();
    }
  };

  return (
    <div className="admin-page-container">
      <div className="table-card">
        <div className="table-header">
          <h2>👥 Team Management</h2>
          <p>Manage staff roles and dashboard access</p>
        </div>
        
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="user-name">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${user.status === 'Active' ? 'active' : 'blocked'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggle(user.id)}
                    className={`btn-action ${user.status === 'Active' ? 'block' : 'unblock'}`}
                  >
                    {user.status === 'Active' ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;