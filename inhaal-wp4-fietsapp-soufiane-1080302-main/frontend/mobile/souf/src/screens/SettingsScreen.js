import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getWeatherById, saveWeather, updateWeather } from '../api';

const SettingsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  console.log('Route params in SettingsScreen:', route.params);
  const { id } = route.params || {};
  const [settings, setSettings] = useState({
    locatie: '',
    tijdstip: '08:00',
    windsnelheid: '3.0',
    regenkans: '25',
    min_temp: '5',
    max_temp: '30',
    kans_sneeuw: '10',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      console.log(`Fetching settings for ID: ${id}`);
      getWeatherById(id)
        .then(response => {
          console.log('Fetched settings:', response.data);
          setSettings(response.data);
        })
        .catch(error => {
          console.error('Error fetching settings:', error);
          Alert.alert('Error', 'Fout bij het ophalen van de instellingen.');
        });
    }
  }, [id]);

  const handleSave = async () => {
    setError(null);
    setSuccessMessage('');

    // Validatie
    if (!settings.locatie) {
      setError('Locatie is verplicht.');
      return;
    }

    if (
      settings.regenkans === '' ||
      settings.kans_sneeuw === '' ||
      settings.windsnelheid === '' ||
      settings.min_temp === '' ||
      settings.max_temp === ''
    ) {
      setError('Alle velden zijn verplicht in te vullen.');
      return;
    }

    if (Number(settings.min_temp) > Number(settings.max_temp)) {
      setError('Minimale temperatuur kan niet hoger zijn dan de maximale temperatuur.');
      return;
    }

    try {
      if (id) {
        await updateWeather(id, settings);
        setSuccessMessage('Instellingen succesvol bijgewerkt!');
      } else {
        const response = await saveWeather(settings);
        setSuccessMessage('Nieuwe instellingen succesvol opgeslagen!');
        console.log('New Weather Entry ID:', response.data.id);
      }
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Fout bij het opslaan van de instellingen.');
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
      <Text style={styles.label}>Locatie:</Text>
      <TextInput
        style={styles.input}
        value={settings.locatie}
        onChangeText={(value) => setSettings({ ...settings, locatie: value })}
      />
      <Text style={styles.label}>Tijdstip van weerpeiling:</Text>
      <TextInput
        style={styles.input}
        value={settings.tijdstip}
        onChangeText={(value) => setSettings({ ...settings, tijdstip: value })}
        placeholder="HH:MM"
      />
      <Text style={styles.label}>Maximale windsnelheid (m/s):</Text>
      <TextInput
        style={styles.input}
        value={settings.windsnelheid}
        onChangeText={(value) => setSettings({ ...settings, windsnelheid: value })}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Maximale regenkans (%):</Text>
      <TextInput
        style={styles.input}
        value={settings.regenkans}
        onChangeText={(value) => setSettings({ ...settings, regenkans: value })}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Minimale temperatuur (°C):</Text>
      <TextInput
        style={styles.input}
        value={settings.min_temp}
        onChangeText={(value) => setSettings({ ...settings, min_temp: value })}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Maximale temperatuur (°C):</Text>
      <TextInput
        style={styles.input}
        value={settings.max_temp}
        onChangeText={(value) => setSettings({ ...settings, max_temp: value })}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Maximale kans op sneeuw (%):</Text>
      <TextInput
        style={styles.input}
        value={settings.kans_sneeuw}
        onChangeText={(value) => setSettings({ ...settings, kans_sneeuw: value })}
        keyboardType="numeric"
      />
      <Button title="Opslaan" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
});

export default SettingsScreen;
