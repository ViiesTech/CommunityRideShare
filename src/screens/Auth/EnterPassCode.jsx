/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
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
import AppText from '../../components/AppText';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import FieldCode from '../../components/CodeField';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import { AppImages } from '../../assets/images';

const EnterPassCode = () => {
  const nav = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';
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

  const handleVerifyCode = () => {
    nav.navigate('NewPassword', { email });
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
              <AppText
                title="Verify identity"
                textColor={AppColors.WHITE}
                textFontWeight
              />
            </View>
            <AppText
              title="Enter the passcode"
              textColor={AppColors.BLACK}
              textSize={3}
              textFontWeight
            />
            <AppText
              title={`We sent a 4-digit code to ${
                email || 'your email address'
              }.`}
              textColor={AppColors.DARKGRAY}
              textSize={1.7}
              lineHeight={2.4}
            />
            <Image source={AppImages.roundedImg} style={styles.heroImage} />
          </View>
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslate }],
              },
            ]}
          >
            <FieldCode />
            <View style={styles.resendRow}>
              <AppText
                title="Didn’t receive it?"
                textColor={AppColors.DARKGRAY}
                textSize={1.5}
              />
              <TouchableOpacity onPress={() => null}>
                <AppText
                  title="Resend"
                  textColor={AppColors.ThemeColor}
                  textFontWeight
                />
              </TouchableOpacity>
            </View>
            <AppButton
              title={'Verify code'}
              bgColor={AppColors.ThemeColor}
              handlePress={handleVerifyCode}
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
    backgroundColor: AppColors.lightGreenColor,
    borderRadius: 32,
    padding: responsiveWidth(6),
    gap: responsiveHeight(1.5),
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: 16,
    backgroundColor: AppColors.green,
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
    gap: responsiveHeight(2.5),
    shadowColor: '#050A30',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 15 },
    elevation: 8,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default EnterPassCode;
