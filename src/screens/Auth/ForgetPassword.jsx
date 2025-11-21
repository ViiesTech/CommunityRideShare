/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import { AppImages } from '../../assets/images';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const nav = useNavigation();
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslate, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardTranslate]);

  const validateEmail = value => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(value);
  };

  const handleSendCode = () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    nav.navigate('EnterPassCode', { email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.WHITE} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.heroBadge}>
              <AppText title="Reset access" textColor={AppColors.WHITE} textFontWeight />
            </View>
            <AppText
              title="Forgot your password?"
              textColor={AppColors.BLACK}
              textSize={3}
              textFontWeight
            />
            <AppText
              title="We’ll send a secure passcode to help you get back in."
              textColor={AppColors.DARKGRAY}
              textSize={1.7}
              lineHeight={2.4}
            />
            <Image source={AppImages.roundedImg} style={styles.heroImage} />
          </View>
          <Animated.View
            style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }]}
          >
            <AppText
              title="Email address"
              textColor={AppColors.GRAY}
              textSize={1.5}
            />
            <AppTextInput
              inputPlaceHolder={'you@example.com'}
              inputWidth={80}
              value={email}
              onChangeText={setEmail}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.helperBox}>
              <View style={styles.helperDot} />
              <AppText
                title="Used recently with your RideShare account"
                textColor={AppColors.DARKGRAY}
                textSize={1.4}
              />
            </View>
            <AppButton
              title={'Send code'}
              bgColor={AppColors.ThemeColor}
              handlePress={handleSendCode}
              buttoWidth={76}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(4),
    gap: responsiveHeight(3),
  },
  heroSection: {
    backgroundColor: AppColors.lightThemeColor,
    borderRadius: 32,
    padding: responsiveWidth(6),
    gap: responsiveHeight(1.5),
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: 16,
    backgroundColor: AppColors.ThemeColor,
  },
  heroImage: {
    width: '100%',
    height: responsiveHeight(18),
    borderRadius: 24,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 28,
    padding: responsiveWidth(6),
    gap: responsiveHeight(2),
    shadowColor: '#050A30',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 15 },
    elevation: 8,
  },
  helperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    backgroundColor: AppColors.inputBgColor,
    padding: responsiveWidth(3),
    borderRadius: 16,
  },
  helperDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.ThemeColor,
  },
});

export default ForgetPassword;
