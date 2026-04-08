import { createContext, useContext, useEffect, useState } from "react";

const locationContext = createContext();

export const LocationProvide = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async (latitude, longitude) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        );

        const data = await res.json();
        const userLocation = data?.address?.state;
        setLocation(userLocation);
      } catch (error) {
        setError("Failed to fetch location data");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationData(latitude, longitude);
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      },
    );
  }, []);

  return (
    <locationContext.Provider value={{ location, loading: true, error }}>
      {children}
    </locationContext.Provider>
  );
};

export const useLocation = () => useContext(locationContext);
