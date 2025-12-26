import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Booking.css"

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // New state for allotting
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [driverId, setDriverId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


const filteredBookings = bookings.filter((booking) => {
 
  return booking.Name?.toLowerCase().includes(searchTerm.toLowerCase());
});

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/booking/list');
     
      const bookingsArray = Array.isArray(response.data) ? response.data : Object.values(response.data);
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

  const handleAssign = async () => {
    if (!driverId) return alert("Please enter a Driver ID");
    
    setIsProcessing(true); // Start loading state
    try {
      await axios.post('http://localhost:3001/booking/assign', {
        bookingId: currentBookingId,
        driverId: parseInt(driverId)
      });

      alert("Driver Assigned & Voucher Emailed!");
      setShowModal(false);
      setDriverId("");
      fetchBookings(); // Refresh list to show 'Confirmed' status
    } catch (error) {
      alert("Assignment failed. Check if Driver ID exists.");
      console.error(error);
    } finally {
      setIsProcessing(false); // Stop loading state
    }
  };

  if (loading) return <div className="loader">Loading bookings...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2>Manage Bookings</h2>
        <div className="header-actions">
        <input 
          type="text" 
          placeholder="Search customer name..." 
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
       
      </div>
    
      </div>
      

      <table className="booking-table">
        <thead>
          <tr>
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
          {filteredBookings.map((booking) => (
            <tr key={booking.id}>
              <td><strong>#{booking.id}</strong></td>
              <td>{booking.Name}</td>
              <td>{booking.car?.model || 'N/A'}</td>
              <td>{booking.PickUpLocation}</td>
              <td>{booking.DropLocation}</td>
              <td>
                {/* Dynamic Status Badges */}
                <span className={`status-badge ${booking.Status?.toLowerCase() || 'pending'}`}>
                  {booking.Status || 'Pending'}
                </span>
              </td>
              <td>
                {booking.Status === 'Confirmed' ? (
                  <span className="success-text">✓ Assigned</span>
                ) : (
                  <button 
                    className="allot-btn" 
                    onClick={() => { setCurrentBookingId(booking.id); setShowModal(true); }}
                  >
                    Allot Driver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Driver Assignment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Driver to #{currentBookingId}</h3>
            <p>Enter the unique Driver ID to confirm the booking and send the voucher.</p>
            <input 
              type="number" 
              placeholder="Enter Driver ID" 
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)} disabled={isProcessing}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleAssign} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Confirm & Send Mail"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;