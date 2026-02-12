import { useState } from "react";
import Login from "./components/Login";
import PropertyList from "./components/PropertyList";
import MyBookings from "./components/MyBookings";


const App = () => {
  // ✅ Initialize login state directly from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      
      {/* 🔥 HEADER WITH LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
 <img
  src={`${import.meta.env.BASE_URL}smartstay-logo.png`}
  alt="SmartStay Logo"
  style={{ height: "60px" }}
/>
</div>


      {/* ✅ Logout Button */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          style={{
            marginBottom: "20px",
            padding: "8px 15px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Logout
        </button>
      )}

      {/* ✅ Show Login if not logged in */}
      {!isLoggedIn && <Login onLogin={handleLogin} />}

      {/* ✅ Properties always visible */}
      <PropertyList />

      {/* ✅ My Bookings only when logged in */}
      {isLoggedIn && <MyBookings />}
    </div>
  );
};

export default App;
