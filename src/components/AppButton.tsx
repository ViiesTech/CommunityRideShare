/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppColors from '../utils/AppColors';
import { responsiveWidth } from '../utils/Responsive_Dimensions';
import AppText from './AppText';

type props = {
  title?: any;
  bgColor?: any;
  handlePress?: () => void;
  textColor?: any;
  textFontWeight?: boolean;
  textSize?: any;
  RightColour?: any;
  leftIcon?: any;
  buttoWidth?: number;
  borderWidth?: any;
  borderColor?: any;
  borderRadius?: any;
  textTransform?: any;
  padding?: any;
  elevation?: any;
  borderRightWidth?: any;
  borderBottomWidth?: any;
  loading?: boolean,
  loaderSize?: any,
  disabled?: boolean,
  style?: any,
};
const AppButton = ({
  title,
  handlePress,
  textColor = AppColors.WHITE,
  textFontWeight = true,
  textSize = 2,
  bgColor,
  RightColour = AppColors.BTNCOLOURS,
  buttoWidth,
  leftIcon,
  borderWidth,
  borderColor,
  borderRadius,
  textTransform,
  padding,
  elevation,
  borderRightWidth,
  borderBottomWidth,
  loading,
  loaderSize,
  disabled,
  style,
}: props) => {
  const isBtnDisabled = Boolean(disabled || loading);
  return (
    <TouchableOpacity
      disabled={isBtnDisabled}
      delayPressIn={0}
      onPress={handlePress}
      style={[{
        backgroundColor: bgColor ? bgColor : AppColors.BTNCOLOURS,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: padding ? padding : 10,
        paddingHorizontal: 12,
        minHeight: responsiveWidth(11),
        borderRadius: borderRadius ? borderRadius : 8,
        opacity: isBtnDisabled ? 0.9 : 1,
        gap: leftIcon ? 7 : 0,
        width: buttoWidth ? responsiveWidth(buttoWidth) : responsiveWidth(),
        borderWidth: borderWidth,
        borderColor: borderColor,
        flexDirection: 'row',
        elevation: elevation,
        borderBottomWidth: borderBottomWidth,
        borderRightWidth: borderRightWidth,
      }, style]}>
      {leftIcon}
      {loading ? (
        <ActivityIndicator color={textColor} size={loaderSize || 'small'} />
      ) : (
        <AppText
          textColor={textColor}
          textSize={textSize}
          title={title}
          textFontWeight={textFontWeight}
          textTransform={textTransform}
        />
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
