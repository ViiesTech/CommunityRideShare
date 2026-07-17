/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useGetCommunityByIdQuery } from '../../../redux/api/apiSlice';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppText';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import { responsiveHeight, responsiveWidth, } from '../../../utils/Responsive_Dimensions';
import Wrapper from '../../../components/Wrapper';
import HomeHeader from '../../../components/HomeHeader';
import { selectCommunityId, selectCommunityRole, selectCurrentUser } from '../../../redux/slices/authSlice';
import BoxShadow from '../../../components/BoxShadow';

const baseActionCards = [
  {
    id: 'offer',
    title: 'Offer a Ride',
    subtitle: 'Share your journey',
    description: 'Post a ride and help community members get to their destination.',
    icon: AppIcons.car,
    badgeColor: '#E5F7ED',
    route: 'OfferRide',
  },
  {
    id: 'find',
    title: 'Find a Ride',
    subtitle: 'Browse available rides',
    description: 'Search for rides offered by community members.',
    icon: AppIcons.search,
    badgeColor: '#E8EEFF',
    route: 'Search',
  },
  {
    id: 'myRides',
    title: 'My Rides',
    subtitle: 'View your rides',
    description: "Manage rides you're offering or joined.",
    icon: AppIcons.calendar,
    badgeColor: '#F3E9FF',
    route: 'Calendar',
  },
];

const Home = () => {
  const navigation = useNavigation();

  const user = useSelector(selectCurrentUser);
  const communityRole = useSelector(selectCommunityRole);
  const communityId = useSelector(selectCommunityId);

  // ✅ Keep existing behavior but add UI/loading guards.
  // Query will trigger immediately when communityId becomes available
  const { data: communityData, isLoading, refetch, } = useGetCommunityByIdQuery(communityId, {
    skip: !communityId,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const pendingCount = communityData?.pendingRequests?.length || 0;
  const adminPanelCard = {
    id: 'adminPanel',
    title: 'Admin Panel',
    subtitle: 'Manage Community',
    description: pendingCount > 0 
      ? `${pendingCount} pending request${pendingCount > 1 ? 's' : ''}` 
      : 'No pending requests',
    icon: AppIcons.settings_red,
    badgeColor: '#FFCFC3',
    route: 'AdminPanel',
  };

  const actionCards = communityRole === 'admin' ? [...baseActionCards, adminPanelCard] : baseActionCards;

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  console.log('communityData', communityData);

  return (
    <Wrapper
      style={styles.safeArea}
      paddingHorizontal={false}
      edges={[]}
      statusBarTranslucent={true}
      statusBarBackgroundColor="transparent"
      barStyle="light-content"
    >
      <HomeHeader
        userName={user?.name || 'NA'}
        communityName={communityData?.name || 'NA'}
        communityCode={communityData?.inviteCode || 'NA'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={responsiveHeight(5)}
          />
        }
      >
        {isLoading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={AppColors.ThemeColor} />
          </View>
        )}

        <View style={styles.actionStack}>
          {actionCards.map(card => {
            const handlePress = card.route ? () => navigation.navigate(card.route) : undefined;
            return (
              <BoxShadow
                key={card.id}
                onPress={handlePress} style={styles.actionCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: responsiveWidth(4) }}>
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: card.badgeColor },
                    ]}
                  >
                    <SVGXml icon={card.icon} width={24} height={24} />
                  </View>
                  <View>
                    <AppText
                      title={card.title}
                      textColor={AppColors.BLACK}
                      textFontWeight
                      textSize={1.9}
                    />
                    <AppText
                      title={card.subtitle}
                      textColor={AppColors.DARKGRAY}
                      textSize={1.5}
                      textFontWeight
                    />
                  </View>
                </View>
                <AppText
                  title={card.description}
                  textColor={AppColors.GRAY}
                  textSize={1.4}
                  lineHeight={2.3}
                />
              </BoxShadow>
            );
          })}
        </View>
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {},
  scrollContent: {
    flexGrow: 1,
    paddingTop: responsiveHeight(9),
  },
  loadingWrap: {
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionStack: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  actionCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(5.5),
    width: responsiveWidth(95),
    backgroundColor: AppColors.WHITE,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextBlock: {
    flex: 1,
    marginLeft: responsiveWidth(2.5),
  },
  activityCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 20,
    padding: responsiveWidth(4),
    borderWidth: 1,
    borderColor: AppColors.LIGHTGRAY,
    gap: responsiveHeight(2),
  },
  activityRow: {
    flexDirection: 'row',
    gap: responsiveWidth(3),
  },
  activityItem: {
    flex: 1,
    paddingVertical: responsiveHeight(2),
    borderRadius: 16,
    backgroundColor: '#F4F6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;

