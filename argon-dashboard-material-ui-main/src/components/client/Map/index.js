import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const MapComponent = ({ address ,isAddressInputEnabled ,setAddress}) => {
  const [searchInput, setSearchInput] = useState(address);
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null); // Store the current marker

  useEffect(() => {
    const goongScript = document.createElement("script");
    goongScript.src = "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js";
    goongScript.async = true;
    document.head.appendChild(goongScript);

    const goongCss = document.createElement("link");
    goongCss.href = "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";
    goongCss.rel = "stylesheet";
    document.head.appendChild(goongCss);

    goongScript.onload = () => {
      goongjs.accessToken = 'JUGTrSgUybslVwAjm0QSLSY3q70Chy3iJPJrx6U2';

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          const newMap = new goongjs.Map({
            container: 'map',
            style: 'https://tiles.goong.io/assets/goong_map_web.json',
            center: [longitude, latitude],
            zoom: 14,
            dragPan: false,
          });
          setMap(newMap);

          const initialMarker = new goongjs.Marker()
            .setLngLat([longitude, latitude])
            .addTo(newMap);
<<<<<<< Updated upstream
          setCurrentMarker(initialMarker); 
=======
          setCurrentMarker(initialMarker); // Set the current marker
>>>>>>> Stashed changes
        }, (error) => {
          console.error("Error fetching current location: ", error);
        });
      } else {
        console.error("Your browser does not support Geolocation");
      }
    };

    return () => {
      document.head.removeChild(goongScript);
      document.head.removeChild(goongCss);
    };
  }, []);

  // Trigger search when address prop changes
  useEffect(() => {
    if (isAddressInputEnabled) {
      handleSearch(address);
    } else {
      setSearchResults([]); // Clear results when input is not enabled
    }
  }, [address, isAddressInputEnabled]);

  const handleSearch = async (input) => {
    if (!input) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`https://rsapi.goong.io/Place/AutoComplete?api_key=T2dHpPp6iud7QqEL4PAJZaPPGKHr2d3s5fCREepi&input=${encodeURIComponent(input)}&location=21.013715429594125,105.79829597455202`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.predictions || []);
    } catch (error) {
      console.error("Error searching for address: ", error);
    }
  };

  const handleSelectResult = async (result) => {
    try {
      const response = await fetch(`https://rsapi.goong.io/Place/Detail?api_key=T2dHpPp6iud7QqEL4PAJZaPPGKHr2d3s5fCREepi&place_id=${result.place_id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const location = data.result.geometry.location;
      const formattedAddress = data.result.formatted_address;
      const placeName = data.result.name;

      if (location) {
        const { lat, lng } = location;

        if (map) {
          map.setCenter([lng, lat]);
          map.setZoom(14);

          if (currentMarker) {
            currentMarker.remove();
          }
          const newMarker = new goongjs.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
          setCurrentMarker(newMarker); 
          setAddress(formattedAddress);
         
          setSearchResults([]);
        }
      } else {
        console.error("No location found for the selected result.");
      }
    } catch (error) {
      console.error("Error fetching location details: ", error);
    }
  };

  return (
    <div>
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result, index) => (
            <li key={index} onClick={() => handleSelectResult(result)}>
              {result.description}
            </li>
          ))}
        </ul>
      )}

      <div id="map" style={{ width: "100%", height: "350px" }}></div>
    </div>
  );
};

MapComponent.propTypes = {
    address: PropTypes.string.isRequired,
    isAddressInputEnabled: PropTypes.bool.isRequired,
    setAddress: PropTypes.func.isRequired,
};

export default MapComponent;
