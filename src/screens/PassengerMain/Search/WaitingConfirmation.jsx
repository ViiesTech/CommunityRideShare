import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import AppText from '../../../components/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';

const WaitingConfirmation = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('CompleteRide');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.WHITE} />
      <View style={styles.container}>
        <View style={styles.placeholderBlock}>
          <View style={styles.placeholderSquare}>
            <View style={styles.placeholderIcon}>
              <SVGXml icon={AppIcons.searchWhite} width={18} height={18} />
            </View>
          </View>
        </View>

        <AppText
          title="Start Your Ride"
          textColor={AppColors.GRAY}
          textSize={1.8}
          style={styles.subtitle}
        />
        <AppText
          title="Rider Has Arrive On Location"
          textColor="#081739"
          textFontWeight
          textSize={2.6}
          style={styles.mainTitle}
        />
        <AppText
          title="Lorem ipsum dolor sit amet consectetur. Viverra magnis rhoncus habitant semper facilisis interdum pretium id ut."
          textColor={AppColors.GRAY}
          textSize={1.35}
          textAlignment="center"
          style={styles.description}
        />

        <View style={styles.spinnerShell}>
          <ActivityIndicator size="large" color={AppColors.ThemeBlue} />
        </View>
        <AppText
          title="Waiting Driver for Start Riding"
          textColor={AppColors.GRAY}
          textSize={1.7}
          style={styles.spinnerLabel}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(8),
    gap: responsiveHeight(2.2),
  },
  placeholderBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  placeholderSquare: {
    width: responsiveWidth(26),
    height: responsiveWidth(26),
    borderRadius: 8,
    backgroundColor: '#E1E6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: '#444B59',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: -responsiveHeight(0.6),
  },
  mainTitle: {
    textAlign: 'center',
    marginTop: -responsiveHeight(0.2),
  },
  description: {
    lineHeight: responsiveHeight(2.3),
    marginHorizontal: responsiveWidth(4),
  },
  spinnerShell: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(4),
  },
  spinnerLabel: {
    marginTop: responsiveHeight(2),
  },
});

export default WaitingConfirmation;
