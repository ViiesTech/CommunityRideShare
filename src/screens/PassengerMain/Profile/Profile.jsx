import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppText';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const stats = [
  { id: 'rides', label: 'Total ride', value: '1,260' },
  { id: 'rating', label: 'Rating', value: '4.8', subText: '(296)', icon: AppIcons.starFilled },
  { id: 'passenger', label: 'As passenger', value: '846' },
];

const Profile = () => {
  const navigation = useNavigation();
  const progress = 0.7;
  const strokeWidth = 4;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progressLength = circumference * progress;
  const badgeRadius = 34;
  const badgeCircumference = 2 * Math.PI * badgeRadius;

  const handleEditProfile = React.useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <SVGXml icon={AppIcons.arrowLeft} width={18} height={18} />
          </TouchableOpacity>
          <AppText title="Profile" textColor={AppColors.BLACK} textFontWeight textSize={2} />
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=47' }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Svg
              width={(radius + strokeWidth) * 2}
              height={(radius + strokeWidth) * 2}
              style={styles.progressSvg}
            >
              <Circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                stroke="#E6EEF8"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                stroke="#0877F5"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${progressLength} ${circumference}`}
                strokeLinecap="round"
                rotation="-90"
                origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}
              />
            </Svg>
          </View>
          <AppText
            title="Anastasia Sya"
            textColor={AppColors.BLACK}
            textFontWeight
            textSize={2.6}
          />
          <AppText
            title="FLORIDA, US"
            textColor={AppColors.DARKGRAY}
            textSize={1.55}
            textFontWeight
          />
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressShell}>
            <Svg viewBox="0 0 100 100" style={styles.progressRing}>
              <Circle
                cx="50"
                cy="50"
                r={badgeRadius}
                stroke="#111111"
                strokeWidth={6}
                strokeDasharray={`${badgeCircumference}`}
                strokeDashoffset={badgeCircumference * (1 - progress)}
                strokeLinecap="round"
                fill="none"
                rotation="-90"
                origin="50,50"
              />
            </Svg>
            <View style={styles.progressBadge}>
              <AppText title="70%" textColor={AppColors.GRAY} textSize={1.5} textFontWeight />
            </View>
          </View>
          <View style={styles.progressTextBlock}>
            <AppText
              title="Complete your profile"
              textColor={AppColors.WHITE}
              textSize={1.85}
              numberOfLines={1}
            />
            <AppText
              title="to stand out"
              textColor="#CFEAFF"
              textSize={1.55}
            />
          </View>
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={handleEditProfile}
          >
            <AppText
              title="Edit Profile"
              textColor={AppColors.WHITE}
              textAlignment="center"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {stats.map(item => (
            <View key={item.id} style={styles.statCard}>
              {item.icon ? (
                <View style={styles.ratingRow}>
                  <SVGXml icon={item.icon} width={16} height={16} />
                  <AppText
                    title={item.value}
                    textColor={AppColors.BLACK}
                    textFontWeight
                    textSize={2}
                  />
                </View>
              ) : (
                <AppText
                  title={item.value}
                  textColor={AppColors.BLACK}
                  textFontWeight
                  textSize={2.6}
                />
              )}
              {item.subText ? (
                <AppText title={item.subText} textColor={AppColors.GRAY} textSize={1.3} />
              ) : null}
              <AppText
                title={item.label}
                textColor={AppColors.DARKGRAY}
                textSize={1.45}
              />
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <AppText title="About" textColor={AppColors.BLACK} textFontWeight textSize={1.8} />
        </View>
        <AppText
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          textColor={AppColors.GRAY}
          textSize={1.6}
          lineHeight={2.4}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  content: {
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(8),
    paddingTop: responsiveHeight(2),
    gap: responsiveHeight(3),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E2E6EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    gap: responsiveHeight(1),
  },
  avatarRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  progressSvg: {
    position: 'absolute',
  },
  progressCard: {
    backgroundColor: '#0D7CF4',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.8),
  },
  progressShell: {
    width: 72,
    height: 72,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    ...StyleSheet.absoluteFillObject,
  },
  progressBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.WHITE,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextBlock: {
    flex: 1,
  },
  editButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingHorizontal: responsiveWidth(2.2),
    paddingVertical: responsiveHeight(1.2),
    minWidth: responsiveWidth(23),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: responsiveWidth(3),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: responsiveHeight(0.4),
    backgroundColor: '#F8F9FC',
    borderRadius: 18,
    paddingVertical: responsiveHeight(2),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeader: {
    marginTop: responsiveHeight(1),
  },
  svgTextWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
