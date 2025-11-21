import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';

const SplashFullScreen = () => {
  const nav = useNavigation();
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(40)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(0)).current;
  const dotOutputRanges = useRef([
    [1, 0.3, 0.3, 1],
    [0.3, 1, 0.3, 0.3],
    [0.3, 0.3, 1, 0.3],
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardTranslate, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardTranslate]);

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, [glowOpacity]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [dotPulse]);

  useEffect(() => {
    const timer = setTimeout(() => {
      nav.replace('OnBoarding');
    }, 2400);
    return () => clearTimeout(timer);
  }, [nav]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, responsiveWidth(60)],
  });

  const dotOpacity = index =>
    dotPulse.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: dotOutputRanges[index],
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.ThemeColor} />
      <View style={styles.container}>
        <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
        <Animated.View
          style={[
            styles.content,
            { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RideShare</Text>
          </View>
          <Text style={styles.title}>Community</Text>
          <Text style={styles.title}>Ride-Share</Text>
          <Text style={styles.subtitle}>
            Neighborhood rides, coordinated in a heartbeat.
          </Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
          </View>
          <View style={styles.dotsRow}>
            {[0, 1, 2].map(index => (
              <Animated.View
                key={index}
                style={[styles.loaderDot, { opacity: dotOpacity(index) }]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.ThemeColor,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.ThemeColor,
  },
  glow: {
    position: 'absolute',
    width: responsiveWidth(90),
    height: responsiveWidth(90),
    borderRadius: responsiveWidth(45),
    backgroundColor: AppColors.WHITE,
    opacity: 0.5,
  },
  content: {
    width: responsiveWidth(85),
    borderRadius: 32,
    paddingVertical: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(8),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    gap: responsiveHeight(2.5),
  },
  badge: {
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: AppColors.WHITE,
    fontWeight: '600',
    fontSize: responsiveFontSize(1.7),
    letterSpacing: 1,
  },
  title: {
    fontSize: responsiveFontSize(4.2),
    color: AppColors.WHITE,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: responsiveFontSize(2.1),
    textAlign: 'center',
    lineHeight: responsiveHeight(3.2),
    marginTop: responsiveHeight(1),
  },
  progressTrack: {
    width: responsiveWidth(60),
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(8,135,252,0.35)',
    overflow: 'hidden',
    marginTop: responsiveHeight(2),
  },
  progressBar: {
    height: 6,
    borderRadius: 6,
    backgroundColor: AppColors.light_yellow,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
    marginTop: responsiveHeight(1.5),
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.WHITE,
  },
});

export default SplashFullScreen;
