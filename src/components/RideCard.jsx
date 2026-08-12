import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import AppButton from './AppButton';
import SVGXml from './SVGXML';
import { AppIcons } from '../assets/icons';
import AppColors from '../utils/AppColors';
import LocationMapModal from './LocationMapModal';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';

const noop = () => { };

const RideCard = ({
  ride,
  stopValues = [],
  onStopChange = noop,
  onRequestPress = noop,
  onChatPress = noop,
  actionLabel = 'Request to join',
  actionColor = AppColors.BLACK,
  actionTextColor = AppColors.WHITE,
  actionButtonWidth = 45,
  showChatButton = true,
  userPickupCoords = null,
  userPickupAddress = '',
  loading = false,
  disabled = false,
}) => {
  const [routeModalVisible, setRouteModalVisible] = useState(false);

  if (!ride) {
    return null;
  }

  const originCoordsObj =
    ride?.origin?.coordinates && ride.origin.coordinates.length === 2
      ? { latitude: ride.origin.coordinates[1], longitude: ride.origin.coordinates[0] }
      : null;

  const destinationCoordsObj =
    ride?.destination?.coordinates && ride.destination.coordinates.length === 2
      ? { latitude: ride.destination.coordinates[1], longitude: ride.destination.coordinates[0] }
      : null;

  // Compute dynamic button title, colors, and disabled state based on booking status
  const getActionButtonConfig = () => {
    const hasRequested = ride?.hasRequested;
    const status = ride?.bookingStatus;

    if (ride?.role === 'driver') {
      return {
        title: 'Offering',
        bgColor: '#39C46A',
        textColor: AppColors.WHITE,
        isDisabled: true,
      };
    }

    if (hasRequested || status) {
      if (status === 'pending') {
        return {
          title: 'Requested',
          bgColor: '#64748B',
          textColor: AppColors.WHITE,
          isDisabled: true,
        };
      }
      if (status === 'approved') {
        return {
          title: 'Joined',
          bgColor: '#10B981',
          textColor: AppColors.WHITE,
          isDisabled: true,
        };
      }
      if (status === 'rejected') {
        return {
          title: 'Request Rejected',
          bgColor: '#EF4444',
          textColor: AppColors.WHITE,
          isDisabled: true,
        };
      }
    }

    return {
      title: actionLabel,
      bgColor: actionColor,
      textColor: actionTextColor,
      isDisabled: false,
    };
  };

  const buttonConfig = getActionButtonConfig();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.profileColumn}>
          <Image source={{ uri: ride?.driver?.avatarUrl }} style={styles.avatar} />
          <View style={styles.ratingRow}>
            <View style={styles.starCircle}>
              <SVGXml icon={AppIcons.starFilled} width={18} height={18} />
            </View>
            <AppText title={ride?.driver?.averageRating} textColor={AppColors.WHITE} textFontWeight textSize={1.5} />
          </View>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.nameRow}>
              <AppText title={ride.driver.name} textColor={AppColors.WHITE} textFontWeight textSize={1.8} />
            </View>
          </View>
          <AppText title={ride?.driver?.email} textColor={AppColors.WHITE} textSize={1.3} />
          <AppText title={`Phone : ${ride?.driver?.phone}`} textColor={AppColors.WHITE} textSize={1.3} />
        </View>
      </View>

      <View style={styles.infoLineContainer}>
        <View style={styles.infoLine}>
          <AppText title="Model" textColor={AppColors.GRAY} textSize={1.6} textFontWeight />
          <AppText title={(ride?.vehicle?.make || ride?.vehicle?.model) ? `${ride?.vehicle?.make || ''} ${ride?.vehicle?.model || ''}`.trim() : 'N/A'} textColor={AppColors.BLACK} textSize={1.5} />
        </View>
        <View style={styles.infoLine}>
          <AppText title="Color" textColor={AppColors.GRAY} textSize={1.6} textFontWeight />
          <AppText title={ride?.vehicle?.color || 'N/A'} textColor={AppColors.BLACK} textSize={1.5} />
        </View>
        <View style={styles.infoLine}>
          <AppText title="License Plate" textColor={AppColors.GRAY} textSize={1.6} textFontWeight />
          <AppText title={ride?.vehicle?.licensePlate || 'N/A'} textColor={AppColors.BLACK} textSize={1.5} />
        </View>
        <View style={styles.infoLine}>
          <AppText title="Seats" textColor={AppColors.GRAY} textSize={1.6} textFontWeight />
          <AppText title={(ride?.availableSeats !== undefined && ride?.totalSeats !== undefined) ? `${ride.availableSeats}/${ride.totalSeats} Seats Available` : 'N/A'} textColor={AppColors.BLACK} textSize={1.5} />
        </View>
        <View style={styles.infoLine}>
          <AppText title="Departure Time" textColor={AppColors.GRAY} textSize={1.6} textFontWeight />
          <AppText title={ride?.departureTime ? moment(ride.departureTime).format('D-MMM-YYYY h:mm A') : 'N/A'} textColor={AppColors.BLACK} textSize={1.5} />
        </View>
      </View>

      <View style={styles.routeSection}>
        <View style={styles.routeIndicator}>
          <View style={styles.routeDotActive} />
          <View style={styles.routeLine} />
          <View style={styles.routeDot} />
        </View>
        <View style={styles.stopList}>
          <View style={styles.stopItem}>
            <AppText
              title={ride?.origin?.address || 'N/A'}
              textColor={AppColors.BLACK}
              textSize={1.5}
              numberOfLines={2}
            />
          </View>
          <View style={styles.stopItem}>
            <AppText
              title={ride?.destination?.address || 'N/A'}
              textColor={AppColors.BLACK}
              textSize={1.5}
              numberOfLines={2}
            />
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setRouteModalVisible(true)}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="route" size={20} color="#0D7CF4" />
        </TouchableOpacity>
        <AppButton
          title={buttonConfig.title}
          bgColor={buttonConfig.bgColor}
          textColor={buttonConfig.textColor}
          handlePress={onRequestPress}
          onPressIn={onRequestPress}
          loading={loading}
          disabled={disabled || buttonConfig.isDisabled}
          buttoWidth={actionButtonWidth}
          borderRadius={8}
          textSize={1.7}
          style={{ height: responsiveWidth(11) }}
        />
      </View>

      {/* Full Screen Route Map Modal */}
      {routeModalVisible && (
        <LocationMapModal
          visible={routeModalVisible}
          mode="route"
          title="Ride Route Map"
          originCoords={originCoordsObj}
          destinationCoords={destinationCoordsObj}
          userPickupCoords={userPickupCoords}
          originAddress={ride?.origin?.address || 'Pickup Location'}
          destinationAddress={ride?.destination?.address || 'Drop-off Location'}
          userPickupAddress={userPickupAddress || 'Your Selected Pickup Location'}
          onClose={() => setRouteModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 24,
    padding: responsiveWidth(4),
    // gap: responsiveHeight(2),
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
  infoLineContainer: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    gap: responsiveWidth(1),
    marginVertical: responsiveWidth(2)
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
    gap: responsiveWidth(2),
    alignItems: 'stretch',
  },
  routeIndicator: {
    width: responsiveWidth(2),
    // backgroundColor: '#0D7CF4',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveWidth(2),
  },
  routeDotActive: {
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(4),
    backgroundColor: AppColors.appBlue,
  },
  routeDot: {
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(4),
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
    gap: responsiveWidth(2.5),
  },
  stopItem: {
    // width: '100%',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveWidth(3)
  },
  chatButton: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(22),
    borderWidth: 1,
    borderColor: AppColors.appBlue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.WHITE,
  },
});

export default React.memo(RideCard);
