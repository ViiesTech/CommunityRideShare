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
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import { AppImages } from '../../assets/images';

const NewPassword = () => {
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
  });
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

  const onChangeText = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleResetPassword = () => {
    if (!state.password.trim()) {
      Alert.alert('Missing password', 'Please enter a new password.');
      return;
    }

    if (state.password.length < 6) {
      Alert.alert('Too short', 'Password must be at least 6 characters.');
      return;
    }

    if (state.password !== state.confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    Alert.alert('Password reset', 'Your password has been updated.', [
      {
        text: 'Back to login',
        onPress: () => nav.navigate('Login'),
      },
    ]);
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
              <AppText title="Final step" textColor={AppColors.WHITE} textFontWeight />
            </View>
            <AppText
              title="Create a new password"
              textColor={AppColors.BLACK}
              textSize={3}
              textFontWeight
            />
            <AppText
              title="Set a strong password that only you know."
              textColor={AppColors.DARKGRAY}
              textSize={1.7}
              lineHeight={2.4}
            />
            <Image source={AppImages.roundedImg} style={styles.heroImage} />
          </View>
          <Animated.View
            style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }]}
          >
            <AppTextInput
              inputPlaceHolder={'New password'}
              inputWidth={80}
              secureTextEntry
              value={state.password}
              onChangeText={text => onChangeText('password', text)}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
            />
            <AppTextInput
              inputPlaceHolder={'Confirm password'}
              inputWidth={80}
              secureTextEntry
              value={state.confirmPassword}
              onChangeText={text => onChangeText('confirmPassword', text)}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
            />
            <View style={styles.passwordHint}>
              <View style={styles.hintDot} />
              <AppText
                title="Use 6+ characters with a mix of numbers and symbols."
                textColor={AppColors.DARKGRAY}
                textSize={1.4}
                lineHeight={2.2}
              />
            </View>
            <AppButton
              title={'Save password'}
              bgColor={AppColors.ThemeColor}
              handlePress={handleResetPassword}
              buttoWidth={75}
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
    backgroundColor: AppColors.hotPink,
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
  passwordHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsiveWidth(2),
    backgroundColor: AppColors.inputBgColor,
    padding: responsiveWidth(3),
    borderRadius: 16,
  },
  hintDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.hotPink,
    marginTop: responsiveHeight(0.5),
  },
});

export default NewPassword;
