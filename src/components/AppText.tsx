/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from './../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';

type textProps = {
  title?: any;
  textSize?: any;
  textColor?: any;
  textFontWeight?: boolean;
  textAlignment?: any;
  textwidth?: any;
  textTransform?: any;
  lineHeight?:any;
  numberOfLines?:any;
  borderBottomWidth?:any;
  borderBottomColor?:any;
};

const AppText = ({
  title,
  textSize,
  textColor,
  textFontWeight,
  textAlignment,
  textwidth,
  textTransform,
  lineHeight,
  numberOfLines,
  borderBottomWidth,
  borderBottomColor,
}: textProps) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        width: textwidth ? responsiveWidth(textwidth) : null,
        fontSize: textSize
          ? responsiveFontSize(textSize)
          : responsiveFontSize(1.4),
        fontWeight: textFontWeight ? 'bold' : 'regular',
        color: textColor ? textColor : AppColors.BLACK,
        textAlign: textAlignment ? textAlignment : null,
        alignSelf: textAlignment ? textAlignment : null,
        textTransform: textTransform,
        lineHeight: responsiveHeight(lineHeight),
        borderBottomWidth: borderBottomWidth,
        borderBottomColor: borderBottomColor,
      }}>
      {title}
    </Text>
  );
};

export default AppText;
