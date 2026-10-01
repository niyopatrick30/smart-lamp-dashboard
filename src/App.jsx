import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [lamps, setLamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get the 3 lamps from PostgreSQL through the backend
  const fetchLamps = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/lamps`);

      if (!response.ok) {
        throw new Error("Failed to load lamps");
      }

      const data = await response.json();

      setLamps(data);
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setError("Unable to connect to the Smart Lamp server.");
    } finally {
      setLoading(false);
    }
  };

  // Change lamp status in PostgreSQL
  const changeLampStatus = async (id, status) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/lamps/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lamp");
      }

      // Backend returns the updated database record
      const updatedLamp = await response.json();

      // Update the dashboard using the database response
      setLamps((currentLamps) =>
        currentLamps.map((lamp) =>
          lamp.id === updatedLamp.id
            ? updatedLamp
            : lamp
        )
      );

    } catch (error) {
      console.error("UPDATE ERROR:", error);
      setError("Failed to update lamp status.");
    }
  };

  // Load lamps when dashboard opens
  useEffect(() => {
    fetchLamps();
  }, []);

  const lampsOn = lamps.filter(
    (lamp) => lamp.status === true
  ).length;

  const lampsOff = lamps.filter(
    (lamp) => lamp.status === false
  ).length;

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading Smart Lamp System...</h2>
      </div>
    );
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="topbar">

        <div>
          <h1>Smart Lamp Control</h1>
          <p>IoT Lighting Management Dashboard</p>
        </div>

        <div className="connection">
          <span className="connection-dot"></span>
          System Online
        </div>

      </header>


      <main className="dashboard">

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* SUMMARY */}
        <section className="summary">

          <div className="summary-card">
            <span>Total Lamps</span>
            <strong>{lamps.length}</strong>
          </div>

          <div className="summary-card">
            <span>Lamps ON</span>
            <strong>{lampsOn}</strong>
          </div>

          <div className="summary-card">
            <span>Lamps OFF</span>
            <strong>{lampsOff}</strong>
          </div>

        </section>


        {/* LAMPS */}
        <section className="lamps-section">

          <div className="section-title">
            <div>
              <h2>My Lamps</h2>
              <p>Control your lamps remotely</p>
            </div>
          </div>


          <div className="lamp-grid">

            {lamps.map((lamp) => (

              <div
                className="lamp-card"
                key={lamp.id}
              >

                {/* Lamp header */}
                <div className="lamp-header">

                  <div>
                    <h2>{lamp.name}</h2>
                    <p>Remote control</p>
                  </div>

                  <div
                    className={`status ${
                      lamp.status ? "on" : "off"
                    }`}
                  >
                    <span className="status-dot"></span>

                    {lamp.status
                      ? "ON"
                      : "OFF"}
                  </div>

                </div>


                {/* Lamp icon */}
                <div className="lamp-icon">
                  💡
                </div>


                {/* Buttons */}
                <div className="buttons">

                  <button
                    className="btn-on"
                    onClick={() =>
                      changeLampStatus(
                        lamp.id,
                        true
                      )
                    }
                  >
                    ON
                  </button>


                  <button
                    className="btn-off"
                    onClick={() =>
                      changeLampStatus(
                        lamp.id,
                        false
                      )
                    }
                  >
                    OFF
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;