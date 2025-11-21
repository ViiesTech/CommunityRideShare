/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import AppColors from '../../utils/AppColors';
import LineBreak from '../../components/LineBreak';
import AuthHeader from '../../components/AuthHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import FieldCode from '../../components/CodeField';

const EnterPassCode = () => {
  const nav = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';

  const handleVerifyCode = () => {
    // Navigate to NewPassword screen
    nav.navigate('NewPassword', { email: email });
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
          pageHead="Enter Pass Code"
          subTitle={`Please enter the passcode we sent to ${email || 'your email'}.`}
        />
        <LineBreak space={3} />
        <FieldCode />
        <LineBreak space={3} />
        <AppButton
          title={'Verify Code'}
          bgColor={AppColors.BLACK}
          handlePress={handleVerifyCode}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EnterPassCode;
