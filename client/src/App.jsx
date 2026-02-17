import { useState, useEffect } from "react";
import Login from "./components/Login";
import PropertyList from "./components/PropertyList";
import MyBookings from "./components/MyBookings";

function App() {

  const [user, setUser] = useState(null);

  // ✅ restore user after refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>

      {/* LOGIN OR LOGOUT */}
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <div>
          <h3>Welcome, {user.name}</h3>

          <button onClick={handleLogout}>
            Logout
          </button>

          <MyBookings />

        </div>
      )}

      <h2>Available Properties</h2>
      <PropertyList />

    </div>
  );
}

export default App;
