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
import { AppImages } from '../../assets/images';
import SocialAuthButton from '../../components/SocialAuthButton';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const nav = useNavigation();
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslate, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardTranslate]);

  const onChangeText = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    const rootNav = nav.getParent();
    if (rootNav) {
      rootNav.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      return;
    }
    nav.navigate('Main');
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
              <AppText title="RideShare" textColor={AppColors.WHITE} textFontWeight />
            </View>
            <AppText
              title="Welcome back"
              textColor={AppColors.BLACK}
              textSize={3.5}
              textFontWeight
            />
            <AppText
              title="Log in to keep your neighborhood rides in sync."
              textColor={AppColors.DARKGRAY}
              textSize={1.7}
              lineHeight={2.5}
            />
            <Image source={AppImages.roundedImg} style={styles.heroImage} />
          </View>
          <Animated.View
            style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }]}
          >
            <AppTextInput
              inputPlaceHolder={'Email address'}
              inputWidth={80}
              value={state.email}
              onChangeText={text => onChangeText('email', text)}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
            />
            <AppTextInput
              inputPlaceHolder={'Password'}
              inputWidth={80}
              secureTextEntry={true}
              value={state.password}
              onChangeText={text => onChangeText('password', text)}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
            />
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => nav.navigate('ForgetPassword')}
            >
              <AppText title={'Forgot password?'} textColor={AppColors.ThemeColor} textFontWeight />
            </TouchableOpacity>
            <AppButton
              title={'Login'}
              bgColor={AppColors.ThemeColor}
              handlePress={handleLogin}
              buttoWidth={82}
            />
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <AppText title="or" textColor={AppColors.GRAY} />
              <View style={styles.dividerLine} />
            </View>
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
          </Animated.View>
          <View style={styles.footer}>
            <AppText
              title="Don't have an account?"
              textColor={AppColors.DARKGRAY}
              textSize={1.6}
            />
            <TouchableOpacity onPress={() => nav.navigate('SignUp')}>
              <AppText title={'Sign up'} textColor={AppColors.ThemeColor} textFontWeight />
            </TouchableOpacity>
          </View>
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
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 16,
    backgroundColor: AppColors.ThemeColor,
  },
  heroImage: {
    width: '100%',
    height: responsiveHeight(20),
    borderRadius: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  forgotButton: {
    alignSelf: 'flex-end',
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
  },
});

export default Login;
