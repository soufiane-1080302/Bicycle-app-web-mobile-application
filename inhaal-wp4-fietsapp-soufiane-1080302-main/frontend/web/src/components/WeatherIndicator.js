import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const WeatherIndicator = () => {
  const { id } = useParams();
  const history = useHistory();
  const [weatherDataList, setWeatherDataList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (id) {
          // Haal specifieke fietsweer op als er een ID is
          const response = await axios.get(`http://localhost:5000/api/weather/${id}`);
          setWeatherData(response.data);
        } else {
          // Haal alle fietsweerdata op als er geen specifieke ID is
          const storedIds = JSON.parse(localStorage.getItem('weatherSettingsIds'));
          if (!storedIds || storedIds.length === 0) {
            console.error('No weather settings IDs found');
            setError('Geen locaties beschikbaar. Voeg eerst een locatie toe.');
            return;
          }
          const weatherPromises = storedIds.map(id => axios.get(`http://localhost:5000/api/weather/${id}`));
          const weatherResponses = await Promise.all(weatherPromises);
          setWeatherDataList(weatherResponses.map(response => response.data));
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Fout bij het ophalen van de gegevens. Probeer het later opnieuw.');
      }
    };

    fetchWeatherData();
  }, [id]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % weatherDataList.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + weatherDataList.length) % weatherDataList.length);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (id && weatherData) {
    // Weergeven van specifieke fietsweerdata
    return (
      <div>
        <h2>Fietsweer voor {weatherData.locatie}</h2>
        {weatherData.isMostRecent && <p><strong>Meest recente gegevens</strong></p>}
        <p>Aangemaakt op: {new Date(weatherData.created_date).toLocaleString()}</p>
        <p>Windsnelheid: {weatherData.windsnelheid} m/s</p>
        <p>Regenkans: {weatherData.regenkans}%</p>
        <p>Temperatuur: {weatherData.min_temp}°C - {weatherData.max_temp}°C</p>
        <p>Sneeuwkans: {weatherData.kans_sneeuw}%</p>
        {weatherData.okay_to_bike && weatherData.okay_to_bike.length > 0 ? (
          weatherData.okay_to_bike.map((day, index) => (
            <div key={index}>
              <p>{day.date}: {day.bike_okay ? 'Goed fietsweer' : 'Geen fietsweer'}</p>
            </div>
          ))
        ) : (
          <p>Geen gegevens beschikbaar</p>
        )}
      </div>
    );
  }

  if (weatherDataList.length === 0) {
    return <div>Loading...</div>;
  }

  // Groepeer gegevens per locatie
  const groupedByLocation = weatherDataList.reduce((acc, weatherData) => {
    if (!acc[weatherData.locatie]) {
      acc[weatherData.locatie] = [];
    }
    acc[weatherData.locatie].push(weatherData);
    return acc;
  }, {});

  // Voeg label toe aan de meest recente invoer per locatie
  Object.keys(groupedByLocation).forEach(location => {
    const sortedData = groupedByLocation[location].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    if (sortedData.length > 0) {
      sortedData[0].isMostRecent = true;
    }
  });

  const currentWeatherData = weatherDataList[currentIndex];
  const isMostRecent = groupedByLocation[currentWeatherData.locatie].some(
    (data) => data.id === currentWeatherData.id && data.isMostRecent
  );

  return (
    <div>
      <h2>Fietsweer voor {currentWeatherData.locatie}</h2>
      {isMostRecent && <p><strong>Meest recente gegevens</strong></p>}
      <p>Aangemaakt op: {new Date(currentWeatherData.created_date).toLocaleString()}</p>
      <p>Windsnelheid: {currentWeatherData.windsnelheid} m/s</p>
      <p>Regenkans: {currentWeatherData.regenkans}%</p>
      <p>Temperatuur: {currentWeatherData.min_temp}°C - {currentWeatherData.max_temp}°C</p>
      <p>Sneeuwkans: {currentWeatherData.kans_sneeuw}%</p>
      {currentWeatherData.okay_to_bike && currentWeatherData.okay_to_bike.length > 0 ? (
        currentWeatherData.okay_to_bike.map((day, index) => (
          <div key={index}>
            <p>{day.date}: {day.bike_okay ? 'Goed fietsweer' : 'Geen fietsweer'}</p>
          </div>
        ))
      ) : (
        <p>Geen gegevens beschikbaar</p>
      )}
      <button onClick={handlePrevious}>Vorige</button>
      <button onClick={handleNext}>Volgende</button>
    </div>
  );
};

export default WeatherIndicator;
