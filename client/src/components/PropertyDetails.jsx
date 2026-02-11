import { useEffect, useState } from "react";
import API from "../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PropertyDetails = ({ property }) => {
  const [availability, setAvailability] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchAvailability = async () => {
    if (!property?._id) return;

    try {
      const res = await API.get(
        `/bookings/property/${property._id}`
      );
      setAvailability(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [property]);

  if (!property) return null;

  // Disable booked dates
  const disabledDates = availability.flatMap((b) => {
    const start = new Date(b.checkInDate);
    const end = new Date(b.checkOutDate);
    const dates = [];

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    return dates;
  });

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalPrice = nights * property.pricePerNight;

  // Step 1: Open Payment Modal
  const handleBookingClick = () => {
    if (!checkIn || !checkOut) {
      setMessage("Please select valid dates.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login to book.");
      return;
    }

    setShowPayment(true);
  };

  // Step 2: Simulate Payment + Create Booking
  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const token = localStorage.getItem("token");

      await API.post(
        "/bookings",
        {
          property: property._id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Payment Successful & Booking Confirmed!");
      setCheckIn(null);
      setCheckOut(null);
      setShowPayment(false);

      fetchAvailability();
    } catch (err) {
        console.log(err);
      setMessage("Payment or Booking failed.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "6px",
      }}
    >
      <h2>{property.title}</h2>
      <p>{property.city}</p>
      <p>₹{property.pricePerNight} / night</p>

      <h4>Select Dates</h4>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <p>Check-in</p>
          <DatePicker
            selected={checkIn}
            onChange={(date) => {
              setCheckIn(date);
              setCheckOut(null);
            }}
            minDate={new Date()}
            excludeDates={disabledDates}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
          />
        </div>

        <div>
          <p>Check-out</p>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            minDate={
              checkIn
                ? new Date(
                    checkIn.getTime() +
                      24 * 60 * 60 * 1000
                  )
                : new Date()
            }
            excludeDates={disabledDates}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
          />
        </div>
      </div>

      {checkIn && checkOut && (
        <>
          <p style={{ marginTop: "10px", color: "green" }}>
            Selected: {checkIn.toDateString()} →{" "}
            {checkOut.toDateString()}
          </p>

          <p style={{ fontWeight: "bold" }}>
            Total Price: ₹{totalPrice}
          </p>

          <button
            onClick={handleBookingClick}
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Book Now
          </button>
        </>
      )}

      {/* 💳 PAYMENT MODAL */}
      {showPayment && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid black",
            backgroundColor: "#f3f4f6",
          }}
        >
          <h3>Payment Gateway</h3>
          <p>Amount: ₹{totalPrice}</p>

          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            style={{
              padding: "8px 15px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {paymentLoading ? "Processing..." : `Pay ₹${totalPrice}`}
          </button>
        </div>
      )}

      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message.includes("Successful")
              ? "green"
              : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default PropertyDetails;
