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
    <div style={{ padding: "30px" }}>
      <h1>🏠 SmartStay</h1>

      {/* ✅ Logout Button */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          style={{
            marginBottom: "20px",
            padding: "8px 15px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
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
