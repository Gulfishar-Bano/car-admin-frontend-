import React, { useState, useEffect } from 'react';
import { getMarkups, createMarkup, deleteMarkup } from '../../services/api';
import "./markup.css";

const MarkupManagement = () => {
  const [markups, setMarkups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ type: 'percentage', value: '' });

  const fetchMarkups = async () => {
    try {
      const data = await getMarkups();
      setMarkups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load markups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMarkups(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMarkup({ ...formData, value: parseFloat(formData.value) });
      alert("Markup updated successfully!");
      setFormData({ ...formData, value: '' });
      fetchMarkups();
    } catch (err) {
      alert("Error creating markup");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this markup record?")) {
      await deleteMarkup(id);
      fetchMarkups();
    }
  };

  return (
    <div className="markup-container">
      <h2>⚙️ Pricing Markup Settings</h2>
      
      <div className="markup-card">
        <h3>Create New Markup</h3>
        <p className="subtitle">This will become the active multiplier for all car fares.</p>
        <form onSubmit={handleSubmit} className="markup-form">
          <div className="form-group">
            <label>Markup Type</label>
            {/* Markup Type Dropdown */}
<select 
  value={formData.type} 
  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
>
  <option value="percentage">Percentage (%)</option>
  <option value="fixed">Fixed Amount (₹)</option>
</select>

{/* Value Input Box */}
<input 
  type="number" 
  placeholder={formData.type === 'percentage' ? "e.g. 10" : "e.g. 500"} 
  value={formData.value}
  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
  required
/>
          </div>
          <button type="submit" className="save-btn">Update Global Pricing</button>
        </form>
      </div>

      <div className="history-section">
        <h3>Markup History</h3>
        <table className="markup-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {markups.map((m, index) => (
              <tr key={m.id}>
                <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                <td>{m.type}</td>
                <td>{m.type === 'percentage' ? `${m.value}%` : `₹${m.value}`}</td>
                <td>
                  {index === 0 ? <span className="badge active">Active</span> : <span className="badge old">Previous</span>}
                </td>
                <td>
                  <button onClick={() => handleDelete(m.id)} className="delete-text">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarkupManagement;