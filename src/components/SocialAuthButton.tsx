import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import AppColors from '../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';

interface Props {
  label: string;
  icon?: ReactNode;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

const SocialAuthButton = ({
  label,
  icon,
  onPress,
  backgroundColor = AppColors.WHITE,
  textColor = AppColors.BLACK,
  borderColor = AppColors.LIGHTGRAY,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.button,
        { backgroundColor: backgroundColor, borderColor: borderColor },
      ]}
      onPress={onPress}
    >
      {icon}
      <AppText title={label} textColor={textColor} textFontWeight />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(1.5),
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
  },
});

export default SocialAuthButton;
