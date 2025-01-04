import React from 'react';
import homeScreen from './homeScreen.jpg';  // Direct import from same directory

const Default = () => {
    return (
        <div className="w-full h-screen">
            <img 
                src={homeScreen}
                alt="homeScreen"
                style={{
                    width: '100%',
                    height: 'auto'
                }}
                onError={(e) => {
                    console.error("Image failed to load");
                }}
            />
        </div>
    );
};

export default Default;