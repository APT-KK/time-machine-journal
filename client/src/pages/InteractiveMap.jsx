import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

const InteractiveMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const libraries = ['places', 'geocoding']; //making static array (debugging)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey:'AIzaSyAOBGbEUxa68MOWaNq00OXDcNmc42Hmexo', //need to hide the APIkey
    libraries: libraries
  });

  useEffect(() => {
    const processLocations = async (entries) => {
      const locationMap = new Map();

      // Grouping entries on the basis of location
      entries.forEach((entry) => {
        if (!locationMap.has(entry.location)) {
          locationMap.set(entry.location, {
            name: entry.location,
            entries: [],
            coordinates: null,
          });
        }
        locationMap.get(entry.location).entries.push(entry);
      });

      // Geocoding each unique location at the same time (efficient method)
      async function geocodeLocations () {
        const geocoder = new google.maps.Geocoder();
        const promises = Array.from(locationMap.values()).map((locationData) =>
          new Promise((resolve) => {
            geocoder.geocode({ address: locationData.name }, (results, status) => {
              if (status === 'OK') {
                resolve({
                  ...locationData,
                  coordinates: {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                  },
                });
              } else {
                resolve(null);
              }
            });
          })
        );
        return (await Promise.all(promises)).filter((location) => location !== null);
      };

      const processedLocations = await geocodeLocations();
      setLocations(processedLocations);
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/entries', {
          credentials: 'include',
          method: 'GET',
         });

          const data = await response.json();

          if (!response.ok) {
            console.error('Server returned an error:', response.status, response.statusText);
            return;
          }
           
          await processLocations(data);
        }
       catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setMapLoading(false);
      }
    };

    if (isLoaded) {
      fetchLocations();
    }
  }, [isLoaded]);

  const handleMarkerClick = async (location) => {
    setSelectedLocation(location);
    await generateSummary(location);
  };

  const generateSummary = async (location) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/location-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          location: location.name,
          entries: location.entries,
        }),
      });

      const data = await response.json();
      setSummary(data.response);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (mapLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="relative h-[70vh] rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          zoom={6}
          center={{ lat: 20.5937, lng: 78.9629 }} // Center of india Co-ords
          mapContainerClassName="w-full h-full"
          options={{
            streetViewControl: false, 
            mapTypeControl: false, //Satellite view off
            fullscreenControl: true,
            styles: [
              {
                featureType: 'poi', //points of interest
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          {locations.map((location, index) => (
            <MarkerF
              key={index}
              position={location.coordinates}
              onClick={() => handleMarkerClick(location)}
            />
          ))}
        </GoogleMap>
      </div>

      {selectedLocation && (
        <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{selectedLocation.name}</h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                <span>Generating summary...</span>
              </div>
            ) : (
              <div className="prose">
                <p className="text-gray-700">{summary}</p>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    There are {selectedLocation.entries.length} entries from this location!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
