/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const stopData = [
  {
    label: 'Mall Central',
    icon: AppIcons.locationGreen,
    accent: '#0AA64F',
  },
  {
    label: 'University Campus',
    icon: AppIcons.locationRed,
    accent: '#FF4D4D',
  },
];

const RiderDetail = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backChevron} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <AppText title="Ride detail" textColor={AppColors.DARKGRAY} textFontWeight textSize={1.6} />
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapCanvas}>
        <View style={styles.routeCard}>
          <View style={styles.routeIndicatorColumn}>
            <View style={styles.indicatorTop} />
            <View style={styles.indicatorLine} />
            <View style={styles.indicatorBottom} />
          </View>
          <View style={styles.routeStops}>
            {stopData.map(stop => (
              <View key={stop.label} style={styles.stopInputWrap}>
                <AppTextInput
                  inputPlaceHolder={stop.label}
                  value={stop.label}
                  containerBg={AppColors.WHITE}
                  borderRadius={18}
                  borderColor="#E8ECF5"
                  borderWidth={1}
                  inputWidth={60}
                  textAlign="left"
                  placeholderTextColor={AppColors.BLACK}
                  rightIcon={(
                    <TouchableOpacity style={[styles.stopIcon, { backgroundColor: `${stop.accent}1A` }] }>
                      <SVGXml icon={stop.icon} width={16} height={16} />
                    </TouchableOpacity>
                  )}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.mapRoute}>
          <View style={styles.routeStartGlow} />
          <View style={styles.routeStart} />
          <View style={styles.routeLineMain} />
          <View style={styles.routeTurn} />
          <View style={styles.routeArrowShell}>
            <View style={styles.routeArrow} />
          </View>
        </View>
      </View>

      <View style={styles.driverCard}>
        <View style={styles.driverHeader}>
          <View style={styles.avatarPlaceholder}>
            <AppText title="LA" textColor={AppColors.WHITE} textFontWeight />
          </View>
          <View style={{ flex: 1, gap: responsiveHeight(0.3) }}>
            <AppText title="Leilani Angel" textColor={AppColors.WHITE} textFontWeight textSize={1.8} />
            <AppText title="(Level 3 Rider)" textColor="rgba(255,255,255,0.85)" textSize={1.2} />
            <AppText title="leilaniangel@gmail.com" textColor={AppColors.WHITE} textSize={1.25} />
            <AppText title="Phone : +12 345 6789" textColor={AppColors.WHITE} textSize={1.25} />
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionBubble}>
              <AppText title="Call" textColor={AppColors.ThemeColor} textFontWeight textSize={1.1} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBubble}>
              <AppText title="Chat" textColor={AppColors.ThemeColor} textFontWeight textSize={1.1} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.driverInfoRow}>
          <AppText title="Car Type" textColor={AppColors.GRAY} textSize={1.3} />
          <AppText title="Honda HRV" textColor={AppColors.BLACK} textFontWeight textSize={1.4} />
        </View>
        <View style={styles.driverInfoRow}>
          <AppText title="Car Seat" textColor={AppColors.GRAY} textSize={1.3} />
          <AppText title="3/4 Seats Available" textColor={AppColors.BLACK} textFontWeight textSize={1.4} />
        </View>
        <View style={styles.driverInfoRow}>
          <AppText title="Time & Date" textColor={AppColors.GRAY} textSize={1.3} />
          <AppText title="Mon, Jan 15, 9:30 AM" textColor={AppColors.BLACK} textFontWeight textSize={1.4} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F6FD',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  backChevron: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: AppColors.BLACK,
    transform: [{ rotate: '45deg' }],
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1C2C56',
  },
  mapCanvas: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#E4ECFB',
    overflow: 'hidden',
    padding: responsiveWidth(4),
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.WHITE,
    borderRadius: 24,
    padding: responsiveWidth(4),
    alignItems: 'center',
    gap: responsiveWidth(4),
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  routeIndicatorColumn: {
    alignItems: 'center',
    gap: responsiveHeight(0.8),
  },
  indicatorTop: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1DAF65',
  },
  indicatorLine: {
    width: 3,
    height: responsiveHeight(6),
    backgroundColor: '#DFE6F5',
    borderRadius: 4,
  },
  indicatorBottom: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4D4D',
  },
  routeStops: {
    flex: 1,
    gap: responsiveHeight(1.2),
  },
  stopInputWrap: {
    width: '100%',
  },
  stopIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapRoute: {
    flex: 1,
    marginTop: responsiveHeight(3),
  },
  routeStartGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(30, 182, 109, 0.14)',
    top: responsiveHeight(4),
    right: responsiveWidth(18),
  },
  routeStart: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1FB768',
    top: responsiveHeight(5.5),
    right: responsiveWidth(22),
    borderWidth: 4,
    borderColor: AppColors.WHITE,
  },
  routeLineMain: {
    position: 'absolute',
    width: 3,
    height: responsiveHeight(20),
    backgroundColor: '#1FB768',
    left: responsiveWidth(35),
    top: responsiveHeight(10),
  },
  routeTurn: {
    position: 'absolute',
    height: 3,
    width: responsiveWidth(30),
    backgroundColor: '#1FB768',
    top: responsiveHeight(30),
    left: responsiveWidth(35),
  },
  routeArrowShell: {
    position: 'absolute',
    bottom: responsiveHeight(1.5),
    left: responsiveWidth(10),
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1FB768',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeArrow: {
    width: 18,
    height: 18,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: AppColors.WHITE,
    transform: [{ rotate: '-45deg' }],
  },
  driverCard: {
    marginTop: responsiveHeight(2.5),
    borderRadius: 26,
    backgroundColor: AppColors.WHITE,
    padding: responsiveWidth(4),
    gap: responsiveHeight(1.4),
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  driverHeader: {
    flexDirection: 'row',
    backgroundColor: '#0D7CF4',
    borderRadius: 20,
    padding: responsiveWidth(3),
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  avatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverActions: {
    gap: responsiveHeight(1),
  },
  actionBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RiderDetail;
