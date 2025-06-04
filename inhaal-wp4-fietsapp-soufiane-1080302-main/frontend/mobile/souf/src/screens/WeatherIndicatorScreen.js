import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getWeatherById } from '../api';

const WeatherIndicatorScreen = () => {
  const route = useRoute();
  console.log('Route params:', route.params);
  const { id } = route.params || {};
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!id) {
        setError('Geen ID meegegeven in de route.');
        setLoading(false);
        return;
      }
      try {
        console.log(`Fetching weather data for ID: ${id}`);
        const response = await getWeatherById(id);
        if (response.data) {
          setWeatherData(response.data);
        } else {
          setError('Geen gegevens beschikbaar.');
        }
      } catch (fetchError) {
        console.error('Error fetching weather data:', fetchError);
        setError('Fout bij het ophalen van de gegevens.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Gegevens laden...</Text>
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Geen gegevens beschikbaar.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fietsweer voor {weatherData.locatie}</Text>
      <Text>Aangemaakt op: {new Date(weatherData.created_date).toLocaleString()}</Text>
      <Text>Windsnelheid: {weatherData.windsnelheid} m/s</Text>
      <Text>Regenkans: {weatherData.regenkans}%</Text>
      <Text>Temperatuur: {weatherData.min_temp}°C - {weatherData.max_temp}°C</Text>
      <Text>Sneeuwkans: {weatherData.kans_sneeuw}%</Text>
      {weatherData.okay_to_bike && weatherData.okay_to_bike.length > 0 ? (
        weatherData.okay_to_bike.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text>{day.date}: {day.bike_okay ? 'Goed fietsweer' : 'Geen fietsweer'}</Text>
          </View>
        ))
      ) : (
        <Text>Geen fietsgegevens beschikbaar.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  dayContainer: { marginVertical: 5 },
});

export default WeatherIndicatorScreen;