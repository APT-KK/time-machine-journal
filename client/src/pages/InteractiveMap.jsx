import React, { useState, useEffect } from 'react';
import { API_ROUTES } from '../config/config';
import MapComponent from './MapComponent';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

const InteractiveMap = () => {
    const [locations, setLocations] = useState([]);
    const [mapLoading, setMapLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const { isAuthenticated } = useAuth();
    const [locationSummary, setLocationSummary] = useState('');

    const processLocations = async (entries) => {
        const locationMap = new Map();
        
        for (const entry of entries) {
            if (!entry || !entry.location) continue;
            
            const processedEntry = {
                date: entry.date ? new Date(entry.date).toISOString() : new Date().toISOString(),
                title: entry.title || 'Untitled',
                content: entry.content || '',
                mood: entry.mood || '',
                location: entry.location
            };
            
            const locationNames = processedEntry.location.split(',').map(loc => loc.trim());
            const primaryLocation = locationNames[0];
            
            if (!locationMap.has(primaryLocation)) {
                try {
                    const response = await fetch(
                        `${API_ROUTES.MAP.GEOCODE}?location=${encodeURIComponent(primaryLocation)}`,
                        { 
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        }
                    );
                    
                    if (!response.ok) {
                        throw new Error('Failed to geocode location');
                    }
                    
                    const data = await response.json();
                    const coordinates = data && data.length > 0
                        ? { 
                            lat: parseFloat(data[0].lat), 
                            lng: parseFloat(data[0].lon) 
                        }
                        : DEFAULT_CENTER;
                    
                    locationMap.set(primaryLocation, {
                        name: primaryLocation,
                        entries: [processedEntry],
                        coordinates
                    });
                    
                } catch (error) {
                    console.error(`Geocoding error for ${primaryLocation}:`, error);
                    locationMap.set(primaryLocation, {
                        name: primaryLocation,
                        entries: [processedEntry],
                        coordinates: DEFAULT_CENTER
                    });
                }
            } else {
                locationMap.get(primaryLocation).entries.push(processedEntry);
            }
        }
        
        const processedLocations = Array.from(locationMap.values());
        setLocations(processedLocations);
        setMapLoading(false);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch(API_ROUTES.ENTRIES, {
                credentials: 'include',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            await processLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setMapLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleMarkerClick = (location, summary) => {
        setSelectedLocation(location);
        setLocationSummary(summary || '');
    };

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} isHomePage={false} />
            <div className="min-h-screen bg-gradient-to-r from-[#FAD961] to-[#F76B1C] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Your Journal Entry Map
                            </h1>
                        </div>
                        
                        <div className="relative rounded-lg overflow-hidden" style={{ height: '500px', width: '100%' }}>
                            {mapLoading ? (
                                <div className="absolute inset-0 flex justify-center items-center bg-gray-50">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <MapComponent 
                                    center={DEFAULT_CENTER}
                                    locations={locations}
                                    onMarkerClick={handleMarkerClick}
                                />
                            )}
                        </div>

                        {selectedLocation && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h2 className="text-xl font-semibold mb-2">{selectedLocation.name}</h2>
                                <p className="mb-4">
                                   There {selectedLocation.entries.length === 1 ? 'is ' : 'are '}
                                    {selectedLocation.entries.length}
                                   {selectedLocation.entries.length === 1 ? ' entry' : ' entries'} at this location..
                                </p>                       
                                <div className="prose max-w-none mt-4">
                                 <p className="text-gray-700">{locationSummary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default InteractiveMap;