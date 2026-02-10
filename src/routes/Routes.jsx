import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from './Auth';
import PassengerMain from './PassengerMain';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Main" component={PassengerMain} />
    </Stack.Navigator>
  );
};

export default Routes;
