import React from 'react';
import { View } from 'react-native';
import AppNavigator from './src/AppNavigator';
import styles from './src/styles/styles';

export default function App() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

