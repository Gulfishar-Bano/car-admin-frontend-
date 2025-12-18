import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bookings from NestJS
  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Replace with your actual API URL
      const response = await axios.get('http://localhost:3001/booking/list');
      const bookingsArray = Object.values(response.data);
      setBookings(bookingsArray);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="admin-panel">
      <h2>Manage Bookings</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Car</th>
            <th>Pick-up</th>
            <th>Drop</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.Name}</td>
              <td>{booking.car?.model || 'Not Assigned'}</td>
              <td>{booking.PickUpLocation}</td>
              <td>{booking.DropLocation}</td>
              
              <td>
                <span className={`status-badge ${booking.Status}`}>
                  {booking.Status}
                </span>
              </td>
              <td>
                <button onClick={() => window.location.href = `/admin/booking/${booking.id}`}>
                  View/Allot Driver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;