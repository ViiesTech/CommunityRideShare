/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View,Text } from 'react-native';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }} >
        {/* <Routes /> */}
        <View><Text>hello</Text></View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;