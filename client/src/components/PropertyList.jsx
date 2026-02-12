import { useEffect, useState } from "react";
import API from "../api/api";
import PropertyDetails from "./PropertyDetails";

const PropertyList = ({ isLoggedIn }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    API.get("/properties")
      .then((res) => setProperties(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Available Properties</h2>
      {Array.isArray(properties) &&
  properties.map((property) => (
        <div
          key={property._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={() => setSelectedProperty(property)}
        >
          <h3>{property.title}</h3>
          <p>{property.city}</p>
          <p>₹{property.pricePerNight} / night</p>
        </div>
      ))}

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default PropertyList;
