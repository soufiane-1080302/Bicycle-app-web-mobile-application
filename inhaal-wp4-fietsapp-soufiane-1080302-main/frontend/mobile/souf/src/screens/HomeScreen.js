import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welkom bij de Fiets Indicator App</Text>
      <Text>Bekijk het fietsweer en beheer je instellingen om de beste fietservaring te hebben!</Text>
      <Button title="Instellingen" onPress={() => navigation.navigate('Settings')} />
      <Button title="Overzicht van Locaties" onPress={() => navigation.navigate('LocationsOverview')} />
    </View>
  );
};

export default HomeScreen;
