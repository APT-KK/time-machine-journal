async function Geocode (req, res) {
    try {
      const { location } = req.query;
  
      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }

      const sanitizedLocation = location.trim();

      if (sanitizedLocation.includes('Lat:') && sanitizedLocation.includes('Long:')) {
 
        try {
          const latMatch = sanitizedLocation.match(/Lat:\s*([-\d.]+)/);
          const longMatch = sanitizedLocation.match(/Long:\s*([-\d.]+)/);
  
          if (latMatch && longMatch) {
  
            const lat = parseFloat(latMatch[1]); //converts it to numbers
            const long = parseFloat(longMatch[1]);
  
            if (!isNaN(lat) && !isNaN(long)) {
              return res.status(200).json([{
                lat: lat.toString(),
                lon: long.toString(),
                display_name: sanitizedLocation
              }]);
            }
          }
        } catch (error) {
          console.error('Error while parsing coordinates:', error);
        }
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(sanitizedLocation)}&countrycodes=in`,
          {
            headers: {'User-Agent': 'TimeMachineJournal/1.0'}
          }
        );
  
        if (!response.ok) {
          throw new Error(`Nominatim API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
  
          return res.status(200).json([{
            lat: '20.5937',
            lon: '78.9629',
            display_name: 'Unknown Location' // default:center of india
          }]);
        }
        res.json(data);

      } catch (error) {
        console.error('Geocoding fetch error:', error);
        res.status(200).json([{
          lat: '20.5937',
          lon: '78.9629',  
          display_name: 'Unknown Location'
        }]);
      }
    } catch (error) {
      console.error('Overall geocoding error:', error);
      res.status(200).json([{
        lat: '20.5937',
        lon: '78.9629',
        display_name: 'Unknown Location'
      }]);
    }
  }

  module.exports = {
    Geocode
  };
  
  
  