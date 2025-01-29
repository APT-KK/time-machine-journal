import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_ROUTES } from '../config/config';

// Updating the marker icon config:
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapComponent = ({ center, locations, onMarkerClick }) => {
    const [summaries, setSummaries] = useState({});
    const [loadingStates, setLoadingStates] = useState({});

    const handlePopupClick = async (location) => {
        if (summaries[location.name]) {
            onMarkerClick(location, summaries[location.name]);
            return;
        }

        setLoadingStates(prev => ({ ...prev, [location.name]: true }));

        try {
            const response = await fetch(API_ROUTES.MAP.SUMMARY, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: location.name,
                    entries: location.entries
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch summary');
            }

            const summary = data.response;

            setSummaries(prev => ({
                ...prev,
                [location.name]: summary
            }));

            onMarkerClick(location, summary);

        } catch (error) {
            console.error('Error fetching location summary:', error);
            const errorMessage = 'Unable to generate summary. Please try again later.';
            setSummaries(prev => ({
                ...prev,
                [location.name]: errorMessage
            }));

            onMarkerClick(location, errorMessage);

        } finally {
            setLoadingStates(prev => ({ ...prev, [location.name]: false }));
        }
    };

    if (!center || !locations) return null;

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MapContainer 
                center={[center.lat, center.lng]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                bounds={[[8.4, 68.7], [37.6, 97.25]]}
                tap={true}
                touchZoom={true}
                dragging={true}
                preferCanvas={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {locations.map((location, index) => (
                    <Marker
                        key={`${location.name}-${index}`}
                        position={[location.coordinates.lat, location.coordinates.lng]}
                        icon={icon}
                        eventHandlers={{
                            click: (e) => {
                                e.originalEvent.stopPropagation();
                                handlePopupClick(location);
                            }
                        }}
                    >
                        <Popup>
                            <div 
                                className="cursor-pointer max-w-xs"
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePopupClick(location);
                                }}
                            >
                                <h3 className="font-semibold mb-2">{location.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {location.entries.length} {location.entries.length === 1 ? 'entry' : 'entries'}
                                </p>
                                {loadingStates[location.name] ? (
                                    <div className="flex justify-center py-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : summaries[location.name] ? (
                                    <p className="text-sm text-gray-700 mt-2">
                                        {summaries[location.name]}
                                    </p>
                                ) : (
                                    <p className="text-sm text-blue-600 hover:text-blue-800">
                                        No summary generated :/
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;