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
import Wrapper from '../../components/Wrapper';
import AppLogo from '../../components/AppLogo';
import { showToast } from '../../utils/toast';
import { useForgetPasswordMutation } from '../../redux/api/apiSlice';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const nav = useNavigation();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const validateEmail = value => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(value);
  };

  const handleSendCode = async () => {
    try {
      if (!email.trim()) {
        showToast('error', 'Missing email', 'Please enter your email address.');
        return;
      }

      if (!validateEmail(email)) {
        showToast('error', 'Invalid email', 'Please enter a valid email address.');
        return;
      }

      const response = await forgetPassword({ email }).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'A 4-digit password reset OTP has been sent to your email address.',
          () => { nav.replace('EnterPassCode', { email }) });
      } else {
        showToast(
          'error',
          response?.errorCode || 'Failed to send code',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err) {
      showToast(
        'error',
        err?.data?.errorCode || 'Failed to send code',
        err?.data?.message || 'Something went wrong'
      );
    }
  };

  return (
    <Wrapper style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <AppLogo style={{ marginVertical: responsiveHeight(5) }} />
          <AppText title="Forgot Password" textSize={4} textFontWeight textAlignment='center' />
          <AppText title="Please enter your email below. We will send you a passcode." textSize={1.6} lineHeight={2} textFontWeight textColor={AppColors.darkGray} textAlignment='center' />
          <AppTextInput
            inputPlaceHolder={'Email Address'}
            inputWidth={84}
            value={email}
            onChangeText={setEmail}
            containerBg={AppColors.inputBgColor}
            borderWidth={0}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppButton
            title={'Send code'}
            bgColor={AppColors.BLACK}
            handlePress={handleSendCode}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {

  },
  scrollContent: {

  },
  card: {
    gap: responsiveHeight(1.5),
  },
});

export default ForgetPassword;
