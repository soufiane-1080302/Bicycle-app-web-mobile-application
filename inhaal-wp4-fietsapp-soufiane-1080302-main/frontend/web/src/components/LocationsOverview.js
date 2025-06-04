import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LocationsOverview = () => {
  const [locations, setLocations] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const storedIds = JSON.parse(localStorage.getItem('weatherSettingsIds'));
        if (!storedIds || storedIds.length === 0) {
          console.error('No weather settings IDs found');
          return;
        }
        const locationPromises = storedIds.map(id => axios.get(`http://localhost:5000/api/weather/${id}`));
        const locationResponses = await Promise.all(locationPromises);
        setLocations(locationResponses.map(response => response.data));
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleEdit = (id) => {
    history.push(`/settings/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/weather/${id}`);
      const updatedIds = JSON.parse(localStorage.getItem('weatherSettingsIds')).filter(storedId => storedId !== id);
      localStorage.setItem('weatherSettingsIds', JSON.stringify(updatedIds));
      setLocations(locations.filter(location => location.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleViewDetails = (id) => {
    // Zorg ervoor dat de gebruiker naar de specifieke weerpagina van de geselecteerde locatie gaat
    history.push(`/weather/${id}`);
  };

  return (
    <div className="container">
      <h2>Overzicht van Locaties</h2>
      {locations.length === 0 ? (
        <p>Geen locaties beschikbaar.</p>
      ) : (
        <div className="list-group">
          {locations.map((location) => (
            <div key={location.id} className="list-group-item">
              <h5 className="mb-1">{location.locatie}</h5>
              <p className="mb-1">Aangemaakt op: {new Date(location.created_date).toLocaleString()}</p>
              <p className="mb-1">Windsnelheid: {location.windsnelheid} m/s, Regenkans: {location.regenkans}%, Temp: {location.min_temp}°C - {location.max_temp}°C, Sneeuwkans: {location.kans_sneeuw}%</p>
              <div className="d-flex justify-content-between">
                <button onClick={() => handleViewDetails(location.id)} className="btn btn-info btn-sm">Details Bekijken</button>
                <button onClick={() => handleEdit(location.id)} className="btn btn-warning btn-sm">Bewerken</button>
                <button onClick={() => handleDelete(location.id)} className="btn btn-danger btn-sm">Verwijderen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsOverview;
