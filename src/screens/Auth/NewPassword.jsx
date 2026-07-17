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
import AppTextInput from '../../components/AppTextInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Wrapper from '../../components/Wrapper';
import { showToast } from '../../utils/toast';
import Feather from 'react-native-vector-icons/Feather';
import AppLogo from '../../components/AppLogo';
import { useResetPasswordMutation } from '../../redux/api/apiSlice';

const NewPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const nav = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';

  const onChangeText = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleResetPassword = async () => {
    try {
      if (!state.password.trim()) {
        showToast('error', 'Missing password', 'Please enter a new password.');
        return;
      }
      const response = await resetPassword({ email, newPassword: state.password , confirmPassword:state.confirmPassword }).unwrap();
      console.log('Reset password response:', response);
      if (response.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'Password reset successfully. Please log in with your new credentials.',
          () => { nav.replace('Login') }
        );
      } else {
        showToast(
          'error',
          response?.errorCode || 'Failed to set new password',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err) {
      showToast(
        'error',
        err?.data?.errorCode || 'Failed to set new password',
        err?.data?.message || 'Something went wrong'
      );
    }
  };

  return (
    <Wrapper style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <AppLogo style={{ marginVertical: responsiveHeight(5) }} />
          <AppText title="New Password" textSize={4} textFontWeight textAlignment='center' />
          <AppText title="Create and confirm your new secure password." textSize={1.6} lineHeight={2} textFontWeight textColor={AppColors.darkGray} textAlignment='center' />
          <AppTextInput
            inputPlaceHolder={'New password'}
            inputWidth={75}
            secureTextEntry={!showPassword}
            value={state.password}
            onChangeText={text => onChangeText('password', text)}
            containerBg={AppColors.inputBgColor}
            borderWidth={0}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={responsiveWidth(6)} color={AppColors.DARKGRAY} />
              </TouchableOpacity>
            }
          />
          <AppTextInput
            inputPlaceHolder={'Confirm password'}
            inputWidth={75}
            secureTextEntry={!showConfirmPassword}
            value={state.confirmPassword}
            onChangeText={text => onChangeText('confirmPassword', text)}
            containerBg={AppColors.inputBgColor}
            borderWidth={0}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={responsiveWidth(6)} color={AppColors.DARKGRAY} />
              </TouchableOpacity>
            }
          />
          <AppButton
            title={'Confirm New Password'}
            bgColor={AppColors.BLACK}
            handlePress={handleResetPassword}
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
    gap: responsiveHeight(1.5),
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
