/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppText';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import FieldCode from '../../components/CodeField';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Wrapper from '../../components/Wrapper';
import AppLogo from '../../components/AppLogo';
import { useResendResetOtpMutation, useVerifyResetOtpMutation } from '../../redux/api/apiSlice';
import { showToast } from '../../utils/toast';

const EnterPassCode = () => {
  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const [resendResetOtp, { isLoading: isResending }] = useResendResetOtpMutation();
  const nav = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';
  const [timer, setTimer] = useState(60);
  const [code, setCode] = useState('');

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyCode = async () => {
    try {
      const response = await verifyResetOtp({ email, otp: code }).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'OTP verified. Now set a new password.',
          () => { nav.replace('NewPassword', { email }) });
      } else {
        showToast(
          'error',
          response?.errorCode || 'Failed to verify code',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err) {
      showToast(
        'error',
        err?.data?.errorCode || 'Failed to verify code',
        err?.data?.message || 'Something went wrong'
      );
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendResetOtp({ email, type: 'reset' }).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Code Resent',
          'A new passcode has been sent to your email.',
          () => { setTimer(60) }
        );
      } else {
        showToast(
          'error',
          response?.errorCode || 'Failed to resend code',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err) {
      showToast(
        'error',
        err?.data?.errorCode || 'Failed to resend code',
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
          <AppText title="Enter Pass Code" textSize={4} textFontWeight textAlignment='center' />
          <AppText title="Please enter the passcode we sent you." textSize={1.6} lineHeight={2} textFontWeight textColor={AppColors.darkGray} textAlignment='center' />
          <FieldCode value={code} setValue={setCode} />
          <AppButton
            title={'Verify Pass Code'}
            bgColor={AppColors.BLACK}
            handlePress={handleVerifyCode}
            loading={isLoading}
          />
        </View>
        {timer > 0 ? (
          <View style={styles.footer}>
            <AppText
              title={`Resend code in 00:${timer < 10 ? `0${timer}` : timer}`}
              textColor={AppColors.DARKGRAY}
              textSize={1.7} textFontWeight
            />
          </View>
        ) : (
          <View style={styles.footer}>
            <AppText
              title="Didn’t receive it?"
              textColor={AppColors.DARKGRAY}
              textSize={1.5}
            />
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={isResending || timer > 0}
              style={{ opacity: isResending || timer > 0 ? 0.6 : 1 }}
            >
              <AppText
                underline
                textFontWeight
                title={isResending ? 'Resending...' : 'Resend'}
                textColor={AppColors.BLACK}
                textSize={1.7}
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {

  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: 'auto'
  },
  card: {
    gap: responsiveHeight(1.5),
  },
});

export default EnterPassCode;
