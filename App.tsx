import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/Routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, Platform, PermissionsAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  LogBox.ignoreAllLogs(true);

  useEffect(() => {
    const requestInitialLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        } catch (err) {
          console.warn('Initial permission error:', err);
        }
      }
    };
    requestInitialLocationPermission();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Routes />
            <Toast />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
