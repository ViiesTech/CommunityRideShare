import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import AppButton from './AppButton';
import SVGXml from './SVGXML';
import { AppIcons } from '../assets/icons';
import AppColors from '../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';

const noop = () => {};

const RideCard = ({
  ride,
  stopValues = [],
  onStopChange = noop,
  onRequestPress = noop,
  onChatPress = noop,
  actionLabel = 'Request to join',
  actionColor = AppColors.BLACK,
  actionTextColor = AppColors.WHITE,
  actionButtonWidth = 65,
  showChatButton = true,
}) => {
  if (!ride) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.profileColumn}>
          <Image source={{ uri: ride.avatar }} style={styles.avatar} />
          <View style={styles.ratingRow}>
            <View style={styles.starCircle}>
              <SVGXml icon={AppIcons.starFilled} width={18} height={18} />
            </View>
            <AppText title={ride.rating} textColor={AppColors.WHITE} textFontWeight textSize={1.5} />
          </View>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.nameRow}>
              <AppText title={ride.name} textColor={AppColors.WHITE} textFontWeight textSize={1.8} />
              <AppText title={`(${ride.level})`} textColor="rgba(255,255,255,0.85)" textSize={1.2} />
            </View>
            {!!ride.badge && (
              <View style={styles.badge}>
                <AppText title={ride.badge} textColor={AppColors.WHITE} textSize={1.1} textFontWeight />
              </View>
            )}
          </View>
          <AppText title={ride.email} textColor={AppColors.WHITE} textSize={1.3} />
          <AppText title={`Phone : ${ride.phone}`} textColor={AppColors.WHITE} textSize={1.3} />
        </View>
      </View>

      <View style={styles.infoLine}>
        <AppText title="Car Type" textColor={AppColors.GRAY} textSize={1.3} />
        <AppText title={ride.carType} textColor={AppColors.BLACK} textFontWeight textSize={1.45} />
      </View>
      <View style={styles.infoLine}>
        <AppText title="Car Seat" textColor={AppColors.GRAY} textSize={1.3} />
        <AppText title={ride.seats} textColor={AppColors.BLACK} textFontWeight textSize={1.45} />
      </View>
      <View style={styles.timeInline}>
        <AppText title="Time & Date" textColor={AppColors.GRAY} textSize={1.3} />
        <View style={styles.timeValue}>
          <AppText title={ride.departure} textColor={AppColors.BLACK} textFontWeight textSize={1.45} />
          {ride.status && (
            <AppText title={`- ${ride.status}`} textColor={AppColors.ThemeColor} textFontWeight textSize={1.3} />
          )}
        </View>
      </View>

      <View style={styles.routeSection}>
        <View style={styles.routeIndicator}>
          <View style={styles.routeDotActive} />
          <View style={styles.routeLine} />
          <View style={styles.routeDot} />
        </View>
        <View style={styles.stopList}>
          {ride.stops.map((stop, index) => (
            <View key={`${ride.id}-${stop.label}`} style={styles.stopItem}>
              <AppTextInput
                inputPlaceHolder={stop.label}
                value={stopValues[index] ?? ''}
                onChangeText={value => onStopChange(index, value)}
                placeholderTextColor={AppColors.BLACK}
                borderRadius={16}
                containerBg="#F7F9FD"
                borderWidth={-1}
                inputWidth={48}
                textAlign="left"
                rightIcon={(
                  <View style={styles.stopActions}>
                    <TouchableOpacity style={[styles.stopActionIcon, styles.searchAction]}>
                      <SVGXml icon={AppIcons.search} width={16} height={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.stopActionIcon, { backgroundColor: `${stop.accent}1A` }]}
                    >
                      <SVGXml icon={stop.icon} width={16} height={16} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionsRow}>
        {showChatButton && (
          <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
            <SVGXml icon={AppIcons.chatBlue} width={22} height={22} />
          </TouchableOpacity>
        )}
        <AppButton
          title={actionLabel}
          bgColor={actionColor}
          textColor={actionTextColor}
          handlePress={onRequestPress}
          buttoWidth={actionButtonWidth}
          borderRadius={22}
          textSize={1.7}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 24,
    padding: responsiveWidth(4),
    gap: responsiveHeight(2),
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  cardHeader: {
    backgroundColor: '#0D7CF4',
    padding: responsiveWidth(3),
    flexDirection: 'row',
    gap: responsiveWidth(3),
    alignItems: 'flex-start',
    marginHorizontal: -responsiveWidth(4),
    marginTop: -responsiveWidth(4),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  profileColumn: {
    alignItems: 'center',
    gap: responsiveHeight(0.6),
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  headerContent: {
    flex: 1,
    gap: responsiveHeight(0.5),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: responsiveWidth(2),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1.5),
    flexShrink: 1,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1),
  },
  starCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  timeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    flex: 1,
    justifyContent: 'flex-end',
  },
  routeSection: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    alignItems: 'stretch',
  },
  routeIndicator: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1),
  },
  routeDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E1E6F2',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4747',
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E1E6F2',
    borderRadius: 2,
  },
  stopList: {
    flex: 1,
    gap: responsiveHeight(1.4),
  },
  stopItem: {
    width: '100%',
  },
  stopActions: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
  },
  stopActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchAction: {
    backgroundColor: '#E8EEFF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: responsiveWidth(3),
    alignItems: 'center',
  },
  chatButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#E0E6F5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.WHITE,
  },
});

export default RideCard;
