import React from "react";
import UserCard from "./UserCard.jsx";
import "./App.css";

import { useEffect, useState } from "react";

// Calculate the distance between two sets of geocoordinates
// using Haversine method
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // Returns distance rounded to 1 decimal place
}

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // <-- Declare search state here
  const [maxDistance, setMaxDistance] = useState("");

  useEffect(function () {
    async function getUsers() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );
      const data = await response.json();
      setUsers(data);
      //console.log(data);
    }

    getUsers();
  }, []);

  // My geocoordinates
  const mylat = 32.924657452950456;
  const mylon = -117.01302745759631;

  const filteredUsers = users.filter(function (user) {
    // Check Name Match
    const matchesName = user.name.toLowerCase().includes(search.toLowerCase());

    // Calculate distance to user
    const distance = getDistanceFromLatLonInKm(
      mylat,
      mylon,
      parseFloat(user.address.geo.lat),
      parseFloat(user.address.geo.lng),
    );

    // Check distance match (if input is empty, ignore distance filter)
    const matchesDistance =
      maxDistance === "" || distance <= Number(maxDistance);

    return matchesName && matchesDistance;
  });

  return (
    <main className="container">
      <header className="app-header">
        <h1> React API Explorer</h1>
        <p>Explore users loaded from a public API</p>
      </header>

      <div className="list-controls">
        {/* Search Control: Empty means all users */}
        <div className="searchControl">
          <label htmlFor="search"> Search for users by name</label>
          <input
            id="search"
            type="text"
            placeholder="Enter a name"
            value={search}
            onChange={function (event) {
              setSearch(event.target.value);
            }}
          />
        </div>

        <div className="searchControl">
          <label htmlFor="maxDistance">Distance within (km)</label>
          <input
            id="maxDistance"
            type="number"
            placeholder="Enter max distance in km"
            value={maxDistance}
            onChange={function (event) {
              setMaxDistance(event.target.value);
            }}
          />
        </div>
      </div>

      <section className="user-list" aria-label="Users">
        {filteredUsers.map(function (user) {
          const distance = getDistanceFromLatLonInKm(
            mylat,
            mylon,
            parseFloat(user.address.geo.lat),
            parseFloat(user.address.geo.lng),
          );

          return (
            <UserCard
              key={user.id}
              name={user.name}
              email={user.email}
              phone={user.phone}
              dist={Math.round(distance).toLocaleString()}
            />
          );
        })}
      </section>
    </main>
  );
}

export default App;
