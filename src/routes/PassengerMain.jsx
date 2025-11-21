import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/PassengerMain/Home';

const Stack = createStackNavigator();

const PassengerMain = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={Home} />
		</Stack.Navigator>
	);
};

export default PassengerMain;
