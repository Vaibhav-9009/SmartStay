import { useEffect, useState } from "react";
import API from "../api/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  const loadBookings = async () => {
    await fetchBookings();
  };

  loadBookings();
}, []);


  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
        console.log(err);
      setMessage("Cancellation failed");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>My Bookings</h2>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((booking) => (
        <div
          key={booking._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h4>{booking.property.title}</h4>
          <p>{booking.property.city}</p>
          <p>
            {new Date(booking.checkInDate).toDateString()} →{" "}
            {new Date(booking.checkOutDate).toDateString()}
          </p>
          <p>Status: {booking.status}</p>

          {booking.status === "booked" && (
            <button
              onClick={() => handleCancel(booking._id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}

      {message && (
        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
      )}
    </div>
  );
};

export default MyBookings;
