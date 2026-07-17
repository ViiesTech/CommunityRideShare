import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Wrapper from '../../components/Wrapper';
import AppColors from '../../utils/AppColors';
import { responsiveFontSize } from '../../utils/Responsive_Dimensions';

const SplashFullScreen = () => {
  const nav = useNavigation();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      nav.replace('OnBoarding');
    }, 1800);

    return () => clearTimeout(timer);
  }, [logoOpacity, logoScale, nav]);

  return (
    <Wrapper
      edges={[]}
      style={styles.wrapper}
      barStyle="light-content"
      statusBarBackgroundColor={AppColors.ThemeColor}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.logoText}>Community</Text>
          <Text style={styles.logoText}>Ride-Share</Text>
        </Animated.View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: AppColors.ThemeColor,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.ThemeColor,
  },
  logo: {
    alignItems: 'center',
  },
  logoText: {
    color: AppColors.WHITE,
    fontSize: responsiveFontSize(5.5),
    fontWeight: '500',
  },
});

export default SplashFullScreen;
