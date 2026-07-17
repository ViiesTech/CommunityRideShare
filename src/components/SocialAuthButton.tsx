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
      style={[
        styles.button,
        { backgroundColor: backgroundColor, borderColor: borderColor },
      ]}
      onPress={onPress}
    >
      {icon}
      <AppText title={label} textColor={textColor} textFontWeight textSize={1.8} />
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
    width: responsiveWidth(),
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
  },
});

export default SocialAuthButton;
