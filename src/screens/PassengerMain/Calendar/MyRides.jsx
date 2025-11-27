import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../components/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import RideCard from '../../../components/RideCard';

const rideTemplate = {
  rating: '5.0',
  level: 'Level 1 Rider',
  email: 'leilaniangel@gmail.com',
  phone: '+12 345 6789',
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
  avatar: 'https://i.pravatar.cc/150?img=32',
};

const offeringRides = [
  {
    ...rideTemplate,
    id: 'offer-1',
    name: 'John Smith',
    badge: 'Active',
  },
];

const pendingRequests = [
  {
    ...rideTemplate,
    id: 'pending-1',
    name: 'John Smith',
    badge: 'Pending',
  },
];

const tabs = [
  { key: 'upcoming', label: 'Upcoming', count: offeringRides.length + pendingRequests.length },
  { key: 'completed', label: 'Completed', count: 0 },
  { key: 'cancelled', label: 'Cancelled', count: 0 },
];

const buildInitialStops = rides => {
  const map = {};
  rides.forEach(ride => {
    map[ride.id] = ride.stops.map(stop => stop.label);
  });
  return map;
};

const MyRides = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [rideStops, setRideStops] = useState(() =>
    buildInitialStops([...offeringRides, ...pendingRequests]),
  );
  const handleRidePress = () => navigation.navigate('RiderDetail');

  const visibleSections = useMemo(() => {
    if (activeTab !== 'upcoming') {
      return { offering: [], pending: [] };
    }
    return { offering: offeringRides, pending: pendingRequests };
  }, [activeTab]);

  const handleStopChange = (rideId, stopIndex, value) => {
    setRideStops(prev => ({
      ...prev,
      [rideId]: prev[rideId].map((label, index) =>
        index === stopIndex ? value : label,
      ),
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + responsiveHeight(10) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleBlock}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <SVGXml icon={AppIcons.arrowLeft} width={20} height={20} />
            </TouchableOpacity>
            <AppText
              title="My Rides"
              textColor={AppColors.BLACK}
              textFontWeight
              textSize={2.2}
            />
            <View style={{ width: responsiveWidth(10) }} />
          </View>
          <AppText
            title="Manage your offered and joined rides"
            textColor={AppColors.GRAY}
            textSize={1.4}
            textAlignment="center"
          />
        </View>

        <View style={styles.tabRow}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <AppText
                  title={`${tab.label} (${tab.count})`}
                  textColor={isActive ? AppColors.BLACK : AppColors.GRAY}
                  textFontWeight={isActive}
                  textSize={1.3}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {visibleSections.offering.length > 0 ? (
          <View style={styles.section}>
            <AppText
              title="Rides You're Offering"
              textColor={AppColors.BLACK}
              textFontWeight
              textSize={1.6}
            />
            {visibleSections.offering.map(ride => (
              <RideCard
                key={ride.id}
                ride={ride}
                stopValues={rideStops[ride.id]}
                onStopChange={(index, value) => handleStopChange(ride.id, index, value)}
                onRequestPress={handleRidePress}
                actionLabel="Active"
                actionColor="#39C46A"
                actionButtonWidth={65}
              />
            ))}
          </View>
        ) : null}

        {visibleSections.pending.length > 0 ? (
          <View style={styles.section}>
            <AppText
              title="Pending Requests"
              textColor={AppColors.BLACK}
              textFontWeight
              textSize={1.6}
            />
            {visibleSections.pending.map(ride => (
              <RideCard
                key={ride.id}
                ride={ride}
                stopValues={rideStops[ride.id]}
                onStopChange={(index, value) => handleStopChange(ride.id, index, value)}
                onRequestPress={handleRidePress}
                actionLabel="Review request"
                actionColor={AppColors.ThemeColor}
                actionButtonWidth={65}
              />
            ))}
          </View>
        ) : null}

        {visibleSections.offering.length === 0 && visibleSections.pending.length === 0 && (
          <View style={styles.emptyState}>
            <AppText
              title="No rides in this filter yet."
              textColor={AppColors.GRAY}
              textSize={1.3}
              textAlignment="center"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5),
    gap: responsiveHeight(2.4),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBlock: {
    gap: responsiveHeight(0.3),
    marginBottom: responsiveHeight(1.2),
  },
  headerButton: {
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EFF2FA',
    borderRadius: 24,
    padding: 4,
    gap: 6,
  },
  tabChip: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: responsiveHeight(0.8),
    alignItems: 'center',
  },
  tabChipActive: {
    backgroundColor: AppColors.WHITE,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  section: {
    gap: responsiveHeight(1.8),
  },
  emptyState: {
    paddingVertical: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyRides;
