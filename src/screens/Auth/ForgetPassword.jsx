/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import AppColors from '../../utils/AppColors';
import AuthHeader from '../../components/AuthHeader';
import LineBreak from '../../components/LineBreak';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import { responsiveWidth } from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppText';
import { useNavigation } from '@react-navigation/native';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const nav = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = () => {
    // Validate email
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Navigate to code entry screen
    nav.navigate('EnterPassCode', { email });
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ flex: 1, backgroundColor: AppColors.WHITE }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: AppColors.WHITE,
        }}
      >
        <AuthHeader
          pageHead="Forget Password"
          subTitle="Please enter your email below. We will send you a passcode."
        />
        <LineBreak space={3} />
        <AppTextInput
          inputPlaceHolder={'Email Address'}
          inputWidth={85}
          value={email}
          onChangeText={text => setEmail(text)}
          containerBg={AppColors.inputBgColor}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <LineBreak space={1.5} />
        <View style={{ width: responsiveWidth(85), alignItems: 'flex-end' }}>
          <TouchableOpacity >
            <AppText
              title={'Use Phone number?'}
              textSize={1.8}
              textColor={ AppColors.GRAY}
              textFontWeight
            />
          </TouchableOpacity>
        </View>
        <LineBreak space={1.5} />
        <AppButton
          title={ 'Send Code'}
          bgColor={AppColors.BLACK}
          handlePress={handleSendCode}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgetPassword;
