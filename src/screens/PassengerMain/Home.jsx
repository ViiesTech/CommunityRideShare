/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import SVGXml from '../../components/SVGXML';
import { AppIcons } from '../../assets/icons';
import { AppImages } from '../../assets/images';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';

const quickActions = [
  {
    id: 'offer',
    title: 'Offer a ride',
    caption: 'Post to your circle',
    icon: AppIcons.car,
    backgroundColor: AppColors.lightGreenColor,
    accent: AppColors.green,
  },
  {
    id: 'plan',
    title: 'Reserve a seat',
    caption: 'Browse trusted rides',
    icon: AppIcons.calendar,
    backgroundColor: AppColors.lightThemeColor,
    accent: '#9810FA',
  },
];

const Home = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <View>
            <AppText
              title="Good morning"
              textColor={AppColors.DARKGRAY}
              textSize={1.6}
            />
            <AppText
              title="Alex Carter"
              textColor={AppColors.BLACK}
              textSize={3}
              textFontWeight
            />
          </View>
          <View style={styles.avatarShell}>
            <Image source={AppImages.roundedImg} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.pillDot} />
          <AppText
            title="Carpool streak · 5 weeks"
            textColor={AppColors.ThemeColor}
            textSize={1.4}
            textFontWeight
          />
        </View>

        <View style={styles.searchBar}>
          <SVGXml icon={AppIcons.search} width={20} height={20} />
          <AppText
            title="Search pickup or destination"
            textColor={AppColors.DARKGRAY}
            textSize={1.5}
          />
        </View>

        <View style={styles.heroCard}>
          <View style={{ gap: responsiveHeight(1) }}>
            <AppText
              title="Plan today’s commute"
              textColor={AppColors.WHITE}
              textSize={2.6}
              textFontWeight
            />
            <AppText
              title="Share rides with your private communities and keep fuel costs down."
              textColor="rgba(255,255,255,0.9)"
              textSize={1.6}
              lineHeight={2.4}
            />
          </View>
          <AppButton
            title="Find rides"
            bgColor={AppColors.WHITE}
            textColor={AppColors.ThemeColor}
            buttoWidth={42}
            handlePress={() => null}
          />
        </View>

        <View style={styles.sectionHeader}>
          <AppText
            title="Quick actions"
            textColor={AppColors.BLACK}
            textSize={2.1}
            textFontWeight
          />
          <AppText title="See all" textColor={AppColors.GRAY} />
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map(action => (
            <View
              key={action.id}
              style={[styles.quickCard, { backgroundColor: action.backgroundColor }]}
            >
              <View style={[styles.quickIconShell, { backgroundColor: action.accent }]}>
                <SVGXml icon={action.icon} width={20} height={20} />
              </View>
              <AppText
                title={action.title}
                textColor={AppColors.BLACK}
                textFontWeight
              />
              <AppText
                title={action.caption}
                textColor={AppColors.DARKGRAY}
                textSize={1.5}
              />
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <AppText
            title="Upcoming ride"
            textColor={AppColors.BLACK}
            textSize={2.1}
            textFontWeight
          />
          <AppText title="View calendar" textColor={AppColors.ThemeColor} textFontWeight />
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleIcon}>
            <SVGXml icon={AppIcons.calendar} width={22} height={22} />
          </View>
          <View style={{ flex: 1, gap: responsiveHeight(0.5) }}>
            <AppText
              title="Campus run · Greenfield"
              textColor={AppColors.BLACK}
              textFontWeight
            />
            <AppText
              title="Today · 07:45 AM"
              textColor={AppColors.DARKGRAY}
              textSize={1.6}
            />
            <AppText
              title="Seats filled · 3 of 4"
              textColor={AppColors.GRAY}
              textSize={1.4}
            />
          </View>
          <View style={styles.statusTag}>
            <AppText title="On track" textColor={AppColors.green} textSize={1.4} textFontWeight />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <AppText
            title="Nearby communities"
            textColor={AppColors.BLACK}
            textSize={2.1}
            textFontWeight
          />
        </View>

        <View style={styles.communityCard}>
          <View style={styles.communityBadge}>
            <SVGXml icon={AppIcons.car} width={20} height={20} />
          </View>
          <View style={{ flex: 1, gap: responsiveHeight(0.6) }}>
            <AppText
              title="Lakeside Residents"
              textColor={AppColors.BLACK}
              textFontWeight
            />
            <AppText
              title="12 active rides · 4 incentives"
              textColor={AppColors.DARKGRAY}
              textSize={1.5}
            />
          </View>
          <AppButton
            title="Join"
            buttoWidth={25}
            bgColor={AppColors.ThemeColor}
            handlePress={() => null}
          />
        </View>

        <View style={styles.communityCard}>
          <View style={[styles.communityBadge, { backgroundColor: AppColors.lightThemeColor }]}
          >
            <SVGXml icon={AppIcons.search} width={18} height={18} />
          </View>
          <View style={{ flex: 1, gap: responsiveHeight(0.6) }}>
            <AppText
              title="Downtown Creators"
              textColor={AppColors.BLACK}
              textFontWeight
            />
            <AppText
              title="6 car owners · waitlist open"
              textColor={AppColors.DARKGRAY}
              textSize={1.5}
            />
          </View>
          <AppButton
            title="Request"
            buttoWidth={30}
            bgColor={AppColors.WHITE}
            textColor={AppColors.ThemeColor}
            borderWidth={1}
            borderColor={AppColors.ThemeColor}
            handlePress={() => null}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
    gap: responsiveHeight(2.5),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarShell: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    borderWidth: 2,
    borderColor: AppColors.ThemeColor,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(7),
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: 20,
    backgroundColor: AppColors.lightThemeColor,
    gap: responsiveWidth(2),
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.ThemeColor,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2.5),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.4),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.LIGHTGRAY,
    backgroundColor: AppColors.WHITE,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroCard: {
    backgroundColor: AppColors.ThemeColor,
    borderRadius: 32,
    padding: responsiveWidth(6),
    gap: responsiveHeight(2.5),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
  },
  quickCard: {
    flex: 1,
    borderRadius: 24,
    padding: responsiveWidth(4),
    gap: responsiveHeight(1),
  },
  quickIconShell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(4),
    padding: responsiveWidth(4),
    borderRadius: 28,
    backgroundColor: AppColors.WHITE,
    borderWidth: 1,
    borderColor: AppColors.lightThemeColor,
  },
  scheduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.lightThemeColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTag: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 16,
    backgroundColor: AppColors.lightGreenColor,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(4),
    padding: responsiveWidth(4),
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.LIGHTGRAY,
  },
  communityBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: AppColors.lightGreenColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
