import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllWeather, deleteWeather } from '../api';

const LocationsOverviewScreen = () => {
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getAllWeather();
        const fetchedLocations = response.data;
        console.log('Fetched Locations:', fetchedLocations);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        Alert.alert('Error', 'Fout bij het ophalen van locaties');
      }
    };

    fetchLocations();
  }, []);

  const handleViewDetails = (id) => {
    console.log('Handle View Details met ID:', id);
    if (id) {
      navigation.navigate('WeatherIndicator', { id });
    } else {
      Alert.alert('Error', 'Geen geldige ID voor navigatie.');
    }
  };

  const handleEdit = (id) => {
    console.log('Handle Edit met ID:', id);
    if (id) {
      navigation.navigate('Settings', { id });
    } else {
      Alert.alert('Error', 'Geen geldige ID voor navigatie.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWeather(id);
      setLocations(locations.filter(location => location.id !== id));
      Alert.alert('Success', 'Locatie succesvol verwijderd.');
    } catch (error) {
      console.error('Error deleting location:', error);
      Alert.alert('Error', 'Fout bij het verwijderen van de locatie.');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Overzicht van Locaties</Text>
      {locations.length === 0 ? (
        <Text>Geen locaties beschikbaar.</Text>
      ) : (
        locations.map((location) => (
          <View key={location.id} style={{ marginVertical: 10, padding: 15, borderWidth: 1, borderRadius: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{location.locatie}</Text>
            <Text>Aangemaakt op: {new Date(location.created_date).toLocaleString()}</Text>
            <Text>Windsnelheid: {location.windsnelheid} m/s, Regenkans: {location.regenkans}%</Text>
            <Button title="WeerIndicator" onPress={() => handleViewDetails(location.id)} />
            <Button title="Bewerken" onPress={() => handleEdit(location.id)} />
            <Button title="Verwijderen" color="red" onPress={() => handleDelete(location.id)} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default LocationsOverviewScreen;
