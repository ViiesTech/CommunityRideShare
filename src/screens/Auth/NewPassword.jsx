/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Alert } from 'react-native';
import AppColors from '../../utils/AppColors';
import AuthHeader from '../../components/AuthHeader';
import LineBreak from '../../components/LineBreak';
import AppTextInput from '../../components/AppTextInput';
import { useNavigation,  } from '@react-navigation/native';
import AppButton from '../../components/AppButton';

const NewPassword = () => {
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
  });
  const nav = useNavigation();

  const onChangeText = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleResetPassword = () => {
    // Validate password
    if (!state.password.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (state.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (state.password !== state.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Show success and navigate to login
    Alert.alert(
      'Success',
      'Your password has been reset successfully',
      [
        {
          text: 'OK',
          onPress: () => nav.navigate('Login'),
        },
      ]
    );
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
          pageHead="New Password"
          subTitle="Create and confirm your new secure password."
        />
        <LineBreak space={3} />
        <AppTextInput
          inputPlaceHolder={'Password'}
          inputWidth={85}
          secureTextEntry={true}
          value={state.password}
          onChangeText={text => onChangeText('password', text)}
          containerBg={AppColors.inputBgColor}
        />
        <LineBreak space={2} />
        <AppTextInput
          inputPlaceHolder={'Confirm new Password'}
          inputWidth={85}
          secureTextEntry={true}
          value={state.confirmPassword}
          onChangeText={text => onChangeText('confirmPassword', text)}
          containerBg={AppColors.inputBgColor}
        />
        <LineBreak space={2} />
        <AppButton
          title={'Confirm New Password'}
          bgColor={AppColors.BLACK}
          handlePress={handleResetPassword}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewPassword;
