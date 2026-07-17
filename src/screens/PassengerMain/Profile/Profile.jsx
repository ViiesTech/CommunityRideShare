import React from 'react';
import {
  Image,
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
import Wrapper from '../../../components/Wrapper';
import AppHeader from '../../../components/AppHeader';
import { selectCurrentUser } from '../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  console.log('Current user data:', user);
  const navigation = useNavigation();
  const progress = user?.profileCompletionPercent / 100; // Example progress value (0 to 1)
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
    <Wrapper style={styles.safeArea} paddingHorizontal={false}>
      <AppHeader title="Profile" paddingHorizontal={true} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            {
              user?.avatarUrl ? (<Image
                source={{ uri: user?.avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />) : (
                <Ionicons
                  name="person-sharp"
                  size={responsiveWidth(25)}
                  color={AppColors.appBlue}
                />)
            }
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
            title={user?.name ? user?.name : 'NA'}
            textColor={AppColors.BLACK}
            textFontWeight
            textSize={2.6} />
        </View>
        {
          (user?.profileCompletionPercent ?? 0) < 100 && (
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
                  <AppText title={`${Math.round(user?.profileCompletionPercent || 0)}%`} textColor={AppColors.GRAY} textSize={1.5} textFontWeight />
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
                onPress={handleEditProfile}>
                <AppText
                  title="Edit Profile"
                  textColor={AppColors.WHITE}
                  textAlignment="center"
                />
              </TouchableOpacity>
            </View>
          )}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <AppText
              title={user?.ride?.totalRide || 0}
              textColor={AppColors.BLACK}
              textFontWeight
              textSize={2.6}
            />
            <AppText
              title={"Total ride"}
              textColor={AppColors.DARKGRAY}
              textSize={1.45}
            />
          </View>

          <View style={styles.statCard}>
            <View style={styles.ratingRow}>
              <SVGXml icon={AppIcons.starFilled} width={responsiveWidth(4.5)} height={responsiveWidth(4.5)} />
              <AppText
                title={user?.averageRating || 0}
                textColor={AppColors.BLACK}
                textFontWeight
                textSize={2.6}
              />
            </View>
            <AppText title={`(${user?.reviewCount || 0})`} textColor={AppColors.GRAY} textSize={1.45} />
          </View>
          <View style={styles.statCard}>
            <AppText
              title={user?.ride?.passenger || 0}
              textColor={AppColors.BLACK}
              textFontWeight
              textSize={2.6}
            />
            <AppText
              title={"As passenger"}
              textColor={AppColors.DARKGRAY}
              textSize={1.45}
            />
          </View>
        </View>

        {user?.about ? (
          <>
            <View style={styles.sectionHeader}>
              <AppText title="About" textColor={AppColors.BLACK} textFontWeight textSize={1.8} />
            </View>
            <AppText
              title={user?.about}
              textColor={AppColors.GRAY}
              textSize={1.6}
              lineHeight={2.4}
            />
          </>
        ) : null}
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
  },
  content: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(3),
    backgroundColor: AppColors.grayBG,
    flexGrow: 1,
    gap: responsiveHeight(3),
    // paddingHorizontal: responsiveWidth(5)
    // paddingTop: responsiveHeight(2),
    // paddingHorizontal: responsiveWidth(6),
    // paddingBottom: responsiveHeight(8),
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
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    width: responsiveWidth(31),
    height: responsiveWidth(31),
    borderRadius: responsiveWidth(40),
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
    gap: responsiveWidth(3)
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: responsiveHeight(0.4),
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
