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

const SignUp = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
  });
  const nav = useNavigation();
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 550,
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

  const handleSignUp = async () => {
    nav.replace('Login');
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
            <View style={styles.stepRow}>
              {[0, 1, 2].map(step => (
                <View
                  key={step}
                  style={[
                    styles.stepDot,
                    step === 0 && styles.stepDotActive,
                  ]}
                />
              ))}
              <AppText
                title="Account setup"
                textColor={AppColors.darkBlue}
                textSize={1.4}
              />
            </View>
            <AppText
              title="Create your carpool identity"
              textColor={AppColors.BLACK}
              textSize={3}
              textFontWeight
            />
            <AppText
              title="Invite-only communities mean safer, smarter rides."
              textColor={AppColors.DARKGRAY}
              textSize={1.8}
              lineHeight={2.6}
            />
            <Image source={AppImages.roundedImg} style={styles.heroImage} />
          </View>
          <Animated.View
            style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }]}
          >
            <AppTextInput
              inputPlaceHolder={'Full name'}
              inputWidth={80}
              value={state.name}
              onChangeText={text => onChangeText('name', text)}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
            />
            <AppTextInput
              inputPlaceHolder={'Email address'}
              inputWidth={80}
              value={state.email}
              onChangeText={text => onChangeText('email', text)}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
            />
            <AppTextInput
              inputPlaceHolder={'Phone number'}
              inputWidth={80}
              value={state.number}
              onChangeText={text => onChangeText('number', text)}
              containerBg={AppColors.inputBgColor}
              borderWidth={0}
              keyboardType="phone-pad"
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
            <View style={styles.policyCopy}>
              <AppText
                title="By continuing you agree to our Terms & Privacy Policy."
                textColor={AppColors.DARKGRAY}
                textSize={1.4}
                lineHeight={2.2}
              />
            </View>
            <AppButton
              title={'Create account'}
              bgColor={AppColors.ThemeColor}
              handlePress={handleSignUp}
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
              title={`Already have an account?`}
              textColor={AppColors.DARKGRAY}
              textSize={1.6}
            />
            <TouchableOpacity onPress={() => nav.navigate('Login')}>
              <AppText title={'Login'} textColor={AppColors.ThemeColor} textFontWeight />
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
  },
});

export default SignUp;
