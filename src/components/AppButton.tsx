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
  style,
}: props) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[{
        backgroundColor: bgColor ? bgColor : AppColors.BTNCOLOURS,
        alignItems: 'center',
        justifyContent: leftIcon ? 'center' : 'space-between',
        padding: padding ? padding : 12,
        borderRadius: borderRadius ? borderRadius : 8,
        gap: leftIcon ? 7 : 0,
        width: buttoWidth ? responsiveWidth(buttoWidth) : responsiveWidth(),
        borderWidth: borderWidth,
        borderColor: borderColor,
        flexDirection: leftIcon ? 'row' : null,
        elevation: elevation,
        borderBottomWidth: borderBottomWidth,
        borderRightWidth: borderRightWidth,
      }, style]}>
      {leftIcon}
      <View />
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
