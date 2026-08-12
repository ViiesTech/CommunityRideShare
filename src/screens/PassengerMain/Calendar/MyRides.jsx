import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import RideCard from '../../../components/RideCard';
import RideCardSkeleton from '../../../components/RideCardSkeleton';
import Wrapper from '../../../components/Wrapper';
import AppHeader from '../../../components/AppHeader';
import { useLazyGetMyRidesQuery } from '../../../redux/api/apiSlice';

const MyRides = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [rides, setRides] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalRides, setTotalRides] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [triggerGetMyRides, { isLoading, isFetching }] = useLazyGetMyRidesQuery();

  const fetchRides = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else if (pageNum > 1) setIsFetchingMore(true);

      const res = await triggerGetMyRides({
        role: 'all',
        status: activeTab,
        page: pageNum,
        limit: 10,
      }).unwrap();

      const newRides = res?.data?.rides || [];
      const pagination = res?.data?.pagination || {};

      if (pageNum === 1 || isRefresh) {
        setRides(newRides);
      } else {
        setRides(prev => {
          const existingIds = new Set(prev.map(r => r.id || r._id));
          const uniqueNew = newRides.filter(r => !existingIds.has(r.id || r._id));
          return [...prev, ...uniqueNew];
        });
      }

      setHasMore(Boolean(pagination.hasMore));
      setTotalRides(pagination.total || newRides.length);
      setPage(pageNum);
    } catch (err) {
      console.log('=== GET MY RIDES ERROR ===', err);
    } finally {
      setIsFetchingMore(false);
      setIsRefreshing(false);
    }
  }, [activeTab, triggerGetMyRides]);

  useEffect(() => {
    setRides([]);
    setPage(1);
    setHasMore(false);
    fetchRides(1);
  }, [activeTab, fetchRides]);

  const handleRefresh = useCallback(() => {
    fetchRides(1, true);
  }, [fetchRides]);

  const loadMoreRides = useCallback(() => {
    if (!hasMore || isFetching || isLoading || isFetchingMore) return;
    fetchRides(page + 1);
  }, [hasMore, isFetching, isLoading, isFetchingMore, page, fetchRides]);

  const tabs = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Wrapper style={styles.safeArea}>
      <AppHeader title="My Rides" description="Manage your offered and joined rides" />

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
                title={`${tab.label}${isActive ? ` (${totalRides})` : ''}`}
                textColor={isActive ? AppColors.BLACK : AppColors.GRAY}
                textFontWeight={isActive}
                textSize={1.3}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {(isLoading && rides.length === 0) ? (
        <View style={styles.skeletonContainer}>
          <RideCardSkeleton />
          <RideCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item, index) => `${item.id || item._id || index}`}
          renderItem={({ item: ride }) => (
            <RideCard
              key={ride.id || ride._id}
              ride={ride}
              onRequestPress={() => navigation.navigate('RiderDetail', { ride })}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[AppColors.ThemeColor]}
              tintColor={AppColors.ThemeColor}
            />
          }
          onEndReached={loadMoreRides}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{ marginTop: responsiveHeight(1) }}>
                <RideCardSkeleton />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading && !isFetchingMore && (
              <View style={styles.emptyState}>
                <AppText
                  title={`No ${activeTab} rides found.`}
                  textColor={AppColors.GRAY}
                  textSize={1.4}
                  textAlignment="center"
                />
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: responsiveHeight(1.5) }} />}
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.grayBG,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: AppColors.disable,
    padding: responsiveWidth(1),
    borderRadius: responsiveWidth(5.5),
    marginBottom: responsiveHeight(1.5),
  },
  tabChip: {
    flex: 1,
    paddingVertical: responsiveWidth(2.5),
    alignItems: 'center',
  },
  tabChipActive: {
    backgroundColor: AppColors.WHITE,
    borderRadius: responsiveWidth(5),
  },
  skeletonContainer: {
    gap: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
  },
  listContent: {
    paddingBottom: responsiveHeight(1),
    paddingTop: responsiveHeight(0.5),
  },
  emptyState: {
    paddingVertical: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyRides;
