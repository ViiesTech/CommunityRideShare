/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TextInput } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';

type props = {
  logo?: any;
  inputPlaceHolder?: any;
  inputBgColour?: any;
  inputWidth?: number;
  containerBg?: any;
  rightIcon?: any;
  secureTextEntry?: any;
  placeholderTextColor?: any;
  inputHeight?: any;
  textAlignVertical?: any;
  placeholderTextfontWeight?: any;
  multiline?: any;
  value?: any;
  onChangeText?: any;
  borderRadius?: any;
  borderBottomWidth?: any;
  borderBottomColor?: any;
  borderWidth?: any;
  borderColor?: any;
  maxLength?: any;
  keyboardType?: any;
  textAlign?: any;
  editable?: any;
  paddingVertical?: any;
};
const AppTextInput = ({
  logo,
  secureTextEntry,
  inputPlaceHolder,
  inputWidth = 60,
  containerBg,
  rightIcon,
  placeholderTextColor,
  inputHeight,
  textAlignVertical,
  placeholderTextfontWeight,
  multiline,
  value,
  onChangeText,
  borderRadius,
  borderBottomWidth,
  borderBottomColor,
  borderWidth,
  borderColor,
  maxLength,
  keyboardType,
  textAlign,
  editable,
  paddingVertical,
}: props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: containerBg,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: borderBottomWidth ? 0 : paddingVertical ? paddingVertical : 5,
        borderRadius: borderRadius ? borderRadius : 12,
        alignItems: multiline ? 'flex-start' : 'center',
        gap: 5,
        borderWidth: borderBottomWidth ? 0 : borderWidth ? borderWidth : 1,
        borderBottomWidth: borderBottomWidth,
        borderBottomColor: borderBottomColor,
        borderColor: borderColor ? borderColor : AppColors.DARKGRAY,
      }}>
      {logo}

      <TextInput
        placeholder={inputPlaceHolder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : AppColors.GRAY
        }
        style={{
          width: responsiveWidth(inputWidth),
          color: AppColors.BLACK,
          height: inputHeight ? responsiveHeight(inputHeight) : null,
          fontWeight: placeholderTextfontWeight
            ? placeholderTextfontWeight
            : null,
          textAlign: textAlign,
        }}
        editable={editable}
        secureTextEntry={secureTextEntry}
        textAlignVertical={textAlignVertical}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
      />

      {rightIcon}
    </View>
  );
};

export default AppTextInput;
