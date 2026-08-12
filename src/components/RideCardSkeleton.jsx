import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import AppColors from '../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';

const RideCardSkeleton = () => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View style={[styles.card, { opacity: opacityAnim }]}>
      {/* Header Skeleton */}
      <View style={styles.cardHeader}>
        <View style={styles.profileColumn}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.ratingPlaceholder} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.namePlaceholder} />
          <View style={styles.emailPlaceholder} />
          <View style={styles.phonePlaceholder} />
        </View>
      </View>

      {/* Info Lines Skeleton */}
      <View style={styles.infoLineContainer}>
        {[1, 2, 3, 4, 5].map(key => (
          <View key={key} style={styles.infoLine}>
            <View style={styles.labelPlaceholder} />
            <View style={styles.valuePlaceholder} />
          </View>
        ))}
      </View>

      {/* Route Section Skeleton */}
      <View style={styles.routeSection}>
        <View style={styles.routeIndicator}>
          <View style={styles.routeDotActive} />
          <View style={styles.routeLine} />
          <View style={styles.routeDot} />
        </View>
        <View style={styles.stopList}>
          <View style={styles.stopPlaceholder} />
          <View style={styles.stopPlaceholder} />
        </View>
      </View>

      {/* Actions Row Skeleton */}
      <View style={styles.actionsRow}>
        <View style={styles.chatButtonPlaceholder} />
        <View style={styles.actionButtonPlaceholder} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 24,
    padding: responsiveWidth(4),
  },
  cardHeader: {
    backgroundColor: '#0D7CF4',
    padding: responsiveWidth(3),
    flexDirection: 'row',
    gap: responsiveWidth(3),
    alignItems: 'center',
    marginHorizontal: -responsiveWidth(4),
    marginTop: -responsiveWidth(4),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  profileColumn: {
    alignItems: 'center',
    gap: responsiveHeight(0.6),
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  ratingPlaceholder: {
    width: 35,
    height: 14,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerContent: {
    flex: 1,
    gap: responsiveHeight(0.8),
  },
  namePlaceholder: {
    width: '60%',
    height: 18,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  emailPlaceholder: {
    width: '80%',
    height: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  phonePlaceholder: {
    width: '50%',
    height: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  infoLineContainer: {
    flexDirection: 'column',
    gap: responsiveWidth(2),
    marginVertical: responsiveWidth(3),
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelPlaceholder: {
    width: '25%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  valuePlaceholder: {
    width: '40%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  routeSection: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
    alignItems: 'stretch',
    marginVertical: responsiveWidth(1),
  },
  routeIndicator: {
    width: responsiveWidth(2),
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
  stopPlaceholder: {
    width: '90%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveWidth(3),
  },
  chatButtonPlaceholder: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(22),
    backgroundColor: '#E2E8F0',
  },
  actionButtonPlaceholder: {
    flex: 1,
    marginLeft: responsiveWidth(3),
    height: responsiveHeight(5.5),
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
  },
});

export default RideCardSkeleton;
