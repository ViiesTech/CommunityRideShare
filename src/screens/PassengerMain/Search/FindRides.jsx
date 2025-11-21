/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import AppButton from '../../../components/AppButton';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const rideResults = [
  {
    id: '1',
    name: 'Leilani Angel',
    level: 'Level 3 Rider',
    email: 'leilaniangel@gmail.com',
    phone: '+12 345 6789',
    rating: '5.0',
    carType: 'Honda HRV',
    seats: '3/4 Seats Available',
    departure: 'Mon, Jan 15, 9:30 AM',
    status: 'Departing Soon',
    stops: [
      {
        label: 'Mall Central',
        accent: '#0AA64F',
        icon: AppIcons.locationGreen,
      },
      {
        label: 'University Campus',
        accent: '#FF4D4D',
        icon: AppIcons.locationRed,
      },
    ],
    badge: 'Available',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: '2',
    name: 'John Smith',
    level: 'Level 1 Rider',
    email: 'leilanianel@gmail.com',
    phone: '+12 345 6789',
    rating: '5.0',
    carType: 'Honda HRV',
    seats: '3/4 Seats Available',
    departure: 'Tue, Jan 16, 10:15 AM',
    status: 'Departing Soon',
    stops: [
      {
        label: 'City Center',
        accent: '#0AA64F',
        icon: AppIcons.locationGreen,
      },
      {
        label: 'Innovation Park',
        accent: '#FF4D4D',
        icon: AppIcons.locationRed,
      },
    ],
    badge: 'Available',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
];

const FindRides = () => {
  const navigation = useNavigation();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const filterAnim = useRef(new Animated.Value(0)).current;
  const filterDuration = 450;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAllRides, setFilterAllRides] = useState('Available');
  const [filterSort, setFilterSort] = useState('By Seat');
  const [rideStops, setRideStops] = useState(() => {
    const initial = {};
    rideResults.forEach(ride => {
      initial[ride.id] = ride.stops.map(stop => stop.label);
    });
    return initial;
  });

  const handleStopChange = (rideId, stopIndex, value) => {
    setRideStops(prev => ({
      ...prev,
      [rideId]: prev[rideId].map((label, index) => (index === stopIndex ? value : label)),
    }));
  };

  const toggleFilters = () => {
    if (filtersVisible) {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: filterDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setFiltersVisible(false);
        }
      });
    } else {
      setFiltersVisible(true);
      filterAnim.setValue(0);
      Animated.timing(filterAnim, {
        toValue: 1,
        duration: filterDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  const filterPanelAnimatedStyle = {
    opacity: filterAnim,
    transform: [
      {
        translateY: filterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-12, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!filtersVisible}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={styles.backChevron} />
          </TouchableOpacity>
          <AppText
            title="Find Rides"
            textColor={AppColors.BLACK}
            textFontWeight
            textSize={2.2}
          />
          <View style={{ width: responsiveWidth(10) }} />
        </View>

        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <AppTextInput
              inputPlaceHolder="Search by Location or driver name"
              containerBg="#F6F8FD"
              borderColor="#E4E9F5"
              borderWidth={1}
              inputWidth={68}
              borderRadius={16}
              logo={<SVGXml icon={AppIcons.search} width={18} height={18} />}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
            <SVGXml icon={AppIcons.filter} width={18} height={18} />
          </TouchableOpacity>
        </View>

        {filtersVisible && (
          <Animated.View style={[styles.filterPanel, filterPanelAnimatedStyle]}>
            <View style={styles.filterGroup}>
              <AppText title="All Rides" textColor={AppColors.GRAY} textSize={1.3} />
              <AppTextInput
                value={filterAllRides}
                onChangeText={setFilterAllRides}
                containerBg={AppColors.WHITE}
                borderRadius={16}
                borderColor="transparent"
                inputWidth={70}
                placeholderTextColor={AppColors.BLACK}
              />
            </View>
            <View style={styles.filterGroup}>
              <AppText title="Sort" textColor={AppColors.GRAY} textSize={1.3} />
              <AppTextInput
                value={filterSort}
                onChangeText={setFilterSort}
                containerBg={AppColors.WHITE}
                borderRadius={16}
                borderColor="transparent"
                inputWidth={70}
                placeholderTextColor={AppColors.BLACK}
              />
            </View>
            <View style={styles.resultsCount}>
              <AppText title="8 Results Found" textColor={AppColors.GRAY} textSize={1.2} textFontWeight textAlignment="center" />
            </View>
          </Animated.View>
        )}

        <View style={[styles.cardsContainer, filtersVisible && styles.cardsContainerDimmed]}>
          {filtersVisible && (
            <View pointerEvents="none" style={styles.cardsDimOverlay} />
          )}
          {rideResults.map(ride => (
            <View key={ride.id} style={styles.card}>
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
                  <View style={styles.badge}>
                    <AppText title={ride.badge} textColor={AppColors.WHITE} textSize={1.1} textFontWeight />
                  </View>
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
                <AppText title={`- ${ride.status}`} textColor={AppColors.ThemeColor} textFontWeight textSize={1.3} />
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
                      value={rideStops[ride.id]?.[index] ?? ''}
                      onChangeText={value => handleStopChange(ride.id, index, value)}
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
                          <TouchableOpacity style={[
                            styles.stopActionIcon,
                            { backgroundColor: `${stop.accent}1A` },
                          ]}>
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
              <TouchableOpacity style={styles.chatButton}>
                <SVGXml icon={AppIcons.chatBlue} width={22} height={22} />
              </TouchableOpacity>
              <AppButton
                title="Request to join"
                bgColor={AppColors.BLACK}
                handlePress={() => navigation.navigate('RiderDetail')}
                buttoWidth={65}
                borderRadius={22}
                textSize={1.7}
              />
            </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
    gap: responsiveHeight(2.5),
    paddingBottom: responsiveHeight(12),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
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
  searchRow: {
    flexDirection: 'row',
    gap: responsiveWidth(3),
    alignItems: 'center',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E9F5',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
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
  cardsContainer: {
    position: 'relative',
    gap: responsiveHeight(2.5),
  },
  cardsContainerDimmed: {
    opacity: 0.45,
  },
  cardsDimOverlay: {
    position: 'absolute',
    top: -responsiveHeight(0.5),
    left: -responsiveWidth(1),
    right: -responsiveWidth(1),
    bottom: -responsiveHeight(0.5),
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
    borderRadius: 32,
    zIndex: 2,
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
  filterPanel: {
    backgroundColor: '#F7F9FD',
    borderRadius: 20,
    padding: responsiveWidth(4),
    gap: responsiveHeight(1.8),
  },
  filterGroup: {
    gap: responsiveHeight(0.8),
  },
  resultsCount: {
    paddingTop: responsiveHeight(0.5),
  },
});

export default FindRides;
