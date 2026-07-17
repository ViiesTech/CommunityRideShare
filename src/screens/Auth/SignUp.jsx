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
  TouchableOpacity,
  View,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import AppText from '../../components/AppText';
import SVGXml from '../../components/SVGXML';
import { AppIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import SocialAuthButton from '../../components/SocialAuthButton';
import Wrapper from '../../components/Wrapper';
import Feather from 'react-native-vector-icons/Feather';
import AppLogo from '../../components/AppLogo';
import { useRegisterMutation } from '../../redux/api/apiSlice';
import { showToast } from '../../utils/toast';

const SignUp = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [state, setState] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigation();

  const onChangeText = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => {
    try {
      if (Object.values(state).some(v => !v)) {
        return showToast('error', 'Account Creation Failed', 'All fields are required');
      }
      const response = await register(state).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'Account Creation successful.',
          () => nav.navigate('VerifyAccount', { email: response.data.userEmail || state.email }));
      } else {
        showToast(
          'error',
          response?.errorCode || 'Account Creation Failed',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err) {
      if (err?.data?.errorCode === 'USER_NOT_VERIFIED') {
        showToast(
          'info',
          'Verification Required',
          err?.data?.message || 'Please verify your email address.',
          () => nav.navigate('VerifyAccount', { email: state.email })
        );
      } else {
        showToast(
          'error',
          err?.data?.errorCode || 'Login Failed',
          err?.data?.message || 'Something went wrong'
        );
      }
    }
  };

  return (
    <Wrapper style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}      
        keyboardShouldPersistTaps="handled">
        <AppLogo style={{ marginVertical: responsiveHeight(5) }} />
        <View style={styles.card} >
          <AppText title="Create an account" textSize={4} textFontWeight textAlignment='center' />
          <AppTextInput
            inputPlaceHolder={'Full name'}
            inputWidth={84}
            value={state.name}
            onChangeText={text => onChangeText('name', text)}
            containerBg={AppColors.inputBgColor}
            borderWidth={0}
          />
          <AppTextInput
            inputPlaceHolder={'Email address'}
            inputWidth={84}
            value={state.email}
            onChangeText={text => onChangeText('email', text)}
            containerBg={AppColors.inputBgColor}
            borderWidth={0}
          />
          <AppTextInput
            inputPlaceHolder={'Phone number'}
            inputWidth={84}
            value={state.number}
            onChangeText={text => onChangeText('number', text)}
            containerBg={AppColors.inputBgColor}
            borderWidth={0}
            keyboardType="phone-pad"
          />
          <AppTextInput
            inputPlaceHolder={'Password'}
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
          <AppButton
            title={'Create account'}
            bgColor={AppColors.BLACK}
            handlePress={handleSignUp}
            loading={isLoading}
          />
          <AppText textFontWeight textSize={1.7} title="Or Login With" textColor={AppColors.darkGray} textAlignment='center' lineHeight={3} />
          <View style={styles.socialWrapper}>
            <SocialAuthButton
              label="Continue with Facebook"
              backgroundColor={AppColors.BLUE}
              borderColor={AppColors.BLUE}
              textColor={AppColors.WHITE}
              icon={<SVGXml icon={AppIcons.facebook_white} width={15} height={15} />}
            />
            <SocialAuthButton
              label="Continue with Google"
              icon={<SVGXml icon={AppIcons.google_black} width={15} height={15} />}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <AppText
            title="Already have an account?"
            textColor={AppColors.DARKGRAY}
            textSize={1.5}
          />
          <TouchableOpacity onPress={() => nav.navigate('Login')}>
            <AppText underline textFontWeight title={'Login'} textColor={AppColors.BLACK} textSize={1.7} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {

  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    backgroundColor: AppColors.lightGreenColor,
    borderRadius: 32,
    padding: responsiveWidth(6),
    gap: responsiveHeight(1.5),
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  stepDotActive: {
    width: 22,
    backgroundColor: AppColors.ThemeColor,
  },
  heroImage: {
    width: '100%',
    height: responsiveHeight(18),
    borderRadius: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  card: {
    gap: responsiveHeight(1.5),
  },
  policyCopy: {
    backgroundColor: AppColors.inputBgColor,
    padding: responsiveWidth(4),
    borderRadius: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.LIGHTGRAY,
  },
  socialWrapper: {
    gap: responsiveHeight(1.5),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
  },
});

export default SignUp;
