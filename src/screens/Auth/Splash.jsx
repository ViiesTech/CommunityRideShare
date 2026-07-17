import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Wrapper from '../../components/Wrapper';
import AppColors from '../../utils/AppColors';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = 132;

const Splash = () => {
  const nav = useNavigation();
  const circleScale = useRef(new Animated.Value(0.2)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  const expandedScale = useMemo(() => {
    const screenDiagonal = Math.sqrt(width * width + height * height);
    return screenDiagonal / CIRCLE_SIZE + 0.4;
  }, []);

  useEffect(() => {
    const introAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(circleOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(circleScale, {
          toValue: 1,
          friction: 5,
          tension: 110,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(450),
      Animated.spring(circleScale, {
        toValue: 0.92,
        friction: 4,
        tension: 130,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(circleScale, {
          toValue: expandedScale,
          friction: 7,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    introAnimation.start();

    const navTimer = setTimeout(() => {
      nav.replace('OnBoarding');
    }, 3000);

    return () => {
      introAnimation.stop();
      clearTimeout(navTimer);
    };
  }, [circleOpacity, circleScale, expandedScale, logoScale, nav]);

  return (
    <Wrapper
      edges={[]}
      statusBarTranslucent
      statusBarBackgroundColor="transparent"
      barStyle="dark-content"
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.circle,
            {
              opacity: circleOpacity,
              transform: [{ scale: circleScale }],
            },
          ]}
        />
        <Animated.View style={[styles.logo, { transform: [{ scale: logoScale }] }]}>
          <Text style={styles.logoText}>Community</Text>
          <Text style={styles.logoText}>Ride-Share</Text>
        </Animated.View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.WHITE,
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: AppColors.ThemeColor,
  },
  logo: {
    alignItems: 'center',
  },
  logoText: {
    color: AppColors.WHITE,
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 23,
  },
});

export default Splash;
