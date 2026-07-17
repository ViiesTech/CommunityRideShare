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
import AppLogo from '../../components/AppLogo';
import Feather from 'react-native-vector-icons/Feather';
import { showToast } from '../../utils/toast';
import { useDispatch } from 'react-redux';
import { setAuthToken, setCommunityId, setCommunityRole, setUser } from '../../redux/slices/authSlice';
import { useLoginMutation } from '../../redux/api/apiSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigation();
  const [login, { isLoading, error }] = useLoginMutation();

  const onChangeText = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    try {
      if (Object.values(state).some(v => !v)) {
        return showToast('error', 'Login Failed', 'All fields are required');
      }
      const response = await login(state).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'Login successful.',
          () => {
            const user = response.data.user
            const token = response.data.token
            const communityRole = user.communityRole || null
            const communityId = user.communityId || null
            dispatch(setCommunityRole(communityRole))
            dispatch(setCommunityId(communityId))
            dispatch(setAuthToken(token));
            dispatch(setUser(user))
          });
      } else {
        showToast(
          'error',
          response?.errorCode || 'Login Failed',
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
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <AppLogo style={{ marginVertical: responsiveHeight(5) }} />
        <View style={styles.card}>
          <AppText title="Login to Continue" textSize={4} textFontWeight textAlignment='center' />
          <AppTextInput
            inputPlaceHolder={'Email address'}
            inputWidth={84}
            value={state.email}
            onChangeText={text => onChangeText('email', text)}
            containerBg={AppColors.inputBgColor}
            borderWidth={0}
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
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => nav.navigate('ForgetPassword')}
          >
            <AppText textSize={1.5} title={'Forgot password?'} textColor={AppColors.BLACK} textFontWeight underline />
          </TouchableOpacity>
          <AppButton
            title={'Login'}
            bgColor={AppColors.BLACK}
            handlePress={handleLogin}
            loading={isLoading}
          />
          <AppText textFontWeight textSize={1.7} title="Or Login With" textColor={AppColors.darkGray} textAlignment='center' lineHeight={3} />
          <View style={styles.socialWrapper}>
            <SocialAuthButton
              label="Continue with Facebook"
              backgroundColor={AppColors.BLUE}
              borderColor={AppColors.BLUE}
              textColor={AppColors.WHITE}
              icon={<SVGXml icon={AppIcons.facebook_white} width={16} height={16} />}
            />
            <SocialAuthButton
              label="Continue with Google"
              icon={<SVGXml icon={AppIcons.google_black} width={16} height={16} />}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <AppText
            title="Don't have an account?"
            textColor={AppColors.DARKGRAY}
            textSize={1.5}
          />
          <TouchableOpacity onPress={() => nav.navigate('SignUp')}>
            <AppText underline textFontWeight title={'Sign up'} textColor={AppColors.BLACK} textSize={1.7} />
          </TouchableOpacity>
        </View>
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
  card: {
    gap: responsiveHeight(1.5),
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -responsiveHeight(0.8),
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

export default Login;
