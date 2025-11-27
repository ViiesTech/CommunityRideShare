/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import RideCard from '../../../components/RideCard';

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
  const insets = useSafeAreaInsets();
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + responsiveHeight(14) },
        ]}
        scrollEnabled={!filtersVisible}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SVGXml icon={AppIcons.arrowLeft} width={20} height={20} />
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
            <RideCard
              key={ride.id}
              ride={ride}
              stopValues={rideStops[ride.id]}
              onStopChange={(index, value) => handleStopChange(ride.id, index, value)}
              onRequestPress={() => navigation.navigate('RiderDetail')}
            />
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
