/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnBoarding from '../screens/Auth/OnBoarding';
import Splash from '../screens/Auth/Splash';
import SplashFullScreen from '../screens/Auth/SplashFullScreen';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import EnterPassCode from '../screens/Auth/EnterPassCode';
import NewPassword from '../screens/Auth/NewPassword';

const Stack = createStackNavigator();
const Auth = () => {
  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="SplashFullScreen" component={SplashFullScreen} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="EnterPassCode" component={EnterPassCode} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        {/* <Stack.Screen name="SelectType" component={SelectType} /> */}
      </Stack.Navigator>
  );
};

export default Auth;
