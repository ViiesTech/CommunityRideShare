import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import { AppImages } from '../../assets/images';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const nav = useNavigation();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY]);

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();
    return () => {
      pulseLoop.stop();
    };
  }, [pulse]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      nav.replace('SplashFullScreen');
    }, 2400);
    return () => clearTimeout(timeout);
  }, [nav]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.WHITE} />
      <View style={styles.backdrop}>
        <View style={styles.decorationTop} />
        <View style={styles.decorationBottom} />
        <Animated.View
          pointerEvents="none"
          style={[styles.pulseHalo, { transform: [{ scale: pulseScale }] }]}
        />
        <Animated.View
          style={[
            styles.card,
            { opacity, transform: [{ scale }, { translateY }] },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image source={AppImages.roundedImg} style={styles.logo} />
          </View>
          <Text style={styles.brand}>Community RideShare</Text>
          <Text style={styles.tagline}>Commute smarter, together.</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.WHITE,
  },
  decorationTop: {
    position: 'absolute',
    top: -responsiveHeight(12),
    right: -responsiveWidth(15),
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    backgroundColor: AppColors.lightThemeColor,
    borderRadius: responsiveWidth(30),
    opacity: 0.3,
  },
  decorationBottom: {
    position: 'absolute',
    bottom: -responsiveHeight(15),
    left: -responsiveWidth(20),
    width: responsiveWidth(70),
    height: responsiveWidth(70),
    backgroundColor: AppColors.lightGreenColor,
    borderRadius: responsiveWidth(35),
    opacity: 0.25,
  },
  pulseHalo: {
    position: 'absolute',
    width: responsiveWidth(75),
    height: responsiveWidth(75),
    borderRadius: responsiveWidth(37.5),
    backgroundColor: AppColors.lightThemeColor,
    opacity: 0.25,
  },
  card: {
    width: responsiveWidth(78),
    paddingVertical: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(6),
    borderRadius: 28,
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    shadowColor: '#0A2A4B',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
    gap: responsiveHeight(2),
  },
  logoWrapper: {
    width: responsiveWidth(38),
    height: responsiveWidth(38),
    borderRadius: responsiveWidth(19),
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(19),
  },
  brand: {
    fontSize: responsiveWidth(5),
    fontWeight: '700',
    color: AppColors.BLACK,
    textAlign: 'center',
  },
  tagline: {
    fontSize: responsiveWidth(3.5),
    color: AppColors.DARKGRAY,
    textAlign: 'center',
  },
});

export default Splash;
