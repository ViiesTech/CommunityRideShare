import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import AppColors from '../../../utils/AppColors';
import { responsiveHeight, responsiveWidth } from '../../../utils/Responsive_Dimensions';
import SVGXml from '../../../components/SVGXML';

const checkMarkIcon = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 6L5.33333 10.3333L15 1.66667" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const CompleteRide = () => {
  const navigation = useNavigation();

  const handleSubmit = () => {
    navigation.navigate('GiveRating');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.WHITE} />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerWrap}>
            <AppText
              title="Payment"
              textColor="#0B1A39"
              textFontWeight
              textSize={2}
            />
          </View>

          <View style={styles.placeholderBlock}>
            <View style={styles.placeholderSquare}>
              <View style={styles.placeholderBadge}>
                <SVGXml icon={checkMarkIcon} width={16} height={12} />
              </View>
            </View>
          </View>

          <View style={styles.messageWrap}>
            <AppText
              title="Yey! you ride ended"
              textColor={AppColors.GRAY}
              textSize={1.5}
              textAlignment="center"
            />
            <AppText
              title="You Arrive On Location"
              textColor="#081739"
              textFontWeight
              textSize={2.6}
              textAlignment="center"
            />
            <View style={styles.helperText}>
              <AppText
                title="Lorem ipsum dolor sit amet consectetur. Viverra magnis rhoncus habitant semper facilisis interdum pretium id ut."
                textColor={AppColors.GRAY}
                textSize={1.35}
                textAlignment="center"
                lineHeight={2.4}
              />
            </View>
          </View>

          <View style={styles.spinnerGroup}>
            <View style={styles.loaderShell}>
              <ActivityIndicator size="large" color="#2D7BFF" />
            </View>
            <AppText
              title="Waiting for your confirmation"
              textColor={AppColors.GRAY}
              textSize={1.5}
              textAlignment="center"
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.feedbackDivider}>
            <AppText
              title="Leave feedback"
              textColor={AppColors.GRAY}
              textSize={1.4}
              textAlignment="center"
            />
          </View>
          <AppButton
            title="Submit"
            handlePress={handleSubmit}
            borderRadius={16}
            buttoWidth={85}
            textSize={1.9}
            bgColor="#0D7CF4"
            loading={false}
            loaderSize="small"
          />
        </View>
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
    paddingHorizontal: responsiveWidth(8),
    paddingTop: responsiveHeight(4),
    paddingBottom: responsiveHeight(2.5),
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    gap: responsiveHeight(3),
  },
  headerWrap: {
    width: '100%',
    alignItems: 'flex-start',
  },
  placeholderBlock: {
    width: '100%',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  placeholderSquare: {
    width: responsiveWidth(28),
    height: responsiveWidth(28),
    borderRadius: 10,
    backgroundColor: '#E2E4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderBadge: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageWrap: {
    width: '100%',
    alignItems: 'center',
    gap: responsiveHeight(1.2),
  },
  helperText: {
    marginTop: -responsiveHeight(0.5),
  },
  spinnerGroup: {
    alignItems: 'center',
    gap: responsiveHeight(1.2),
  },
  loaderShell: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    gap: responsiveHeight(1.5),
  },
  feedbackDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DFE3EB',
    paddingTop: responsiveHeight(1.5),
    alignItems: 'center',
  },
});

export default CompleteRide;
