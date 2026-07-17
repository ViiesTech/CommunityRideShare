import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import AppColors from '../utils/AppColors';
import AppText from './AppText';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';

type Props = {
  style?: StyleProp<ViewStyle>;
};

const AppLogo = ({ style }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <AppText 
        title="Ride-Share" 
        textColor={AppColors.WHITE} 
        textFontWeight 
        textSize={2.5} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(2),
    backgroundColor: AppColors.ThemeColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default AppLogo;
