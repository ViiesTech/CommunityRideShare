/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppText';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import SideMenuDrawer from '../../../components/SideMenuDrawer';


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

const adminPanelCard = {
  id: 'adminPanel',
  title: 'Admin Panel',
  subtitle: 'Manage Community',
  description: 'No pending requests',
  icon: AppIcons.settings_red,
  badgeColor: '#FFCFC3',
  route: 'AdminPanel',
};

const activityStats = [
  { id: 'members', value: '5', label: 'Members' },
  { id: 'active', value: 'Active', label: 'Members' },
  { id: 'trust', value: 'Trust-Based', label: 'Community' },
];


const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  // Check if type param is 'create' to show Admin Panel
  const type = route?.params?.type;
  const actionCards = type === 'create' ? [...baseActionCards, adminPanelCard] : baseActionCards;

  const handleMenuAction = action => {
    setMenuOpen(false);
    switch (action) {
      case 'myRide':
        navigation.navigate('Calendar');
        break;
      case 'editProfile':
        navigation.navigate('EditProfile');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      case 'help':
        navigation.navigate('DocumentInfo', { type: 'help' });
        break;
      case 'logout':
        navigation.navigate('Auth');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroBackground}>
          <View style={styles.heroAccent} />
          <View style={styles.welcomeCard}>
            <View style={styles.cardContent}>
              <AppText
                title="Welcome, Alex"
                textColor={AppColors.BLACK}
                textFontWeight
                textSize={2}
              />
              <View style={styles.communityRow}>
                <SVGXml icon={AppIcons.users} width={18} height={18} />
                <AppText
                  title="Downtown Commuters"
                  textColor={AppColors.ThemeColor}
                  textFontWeight
                  textSize={1.4}
                />
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuButton}
              onPress={() => setMenuOpen(true)}
            >
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </TouchableOpacity>
          </View>

          <View style={styles.codeCard}>
            <AppText
              title="Community Code: DEMO123"
              textColor={AppColors.BLACK}
              textFontWeight
              textAlignment="center"
            />
            <AppText
              title="Share this code with others to invite them"
              textColor={AppColors.DARKGRAY}
              textSize={1.4}
              textAlignment="center"
            />
          </View>
        </View>

        <View style={styles.actionStack}>
          {actionCards.map(card => {
            const isTouchable = Boolean(card.route);
            const Wrapper = isTouchable ? TouchableOpacity : View;
            const wrapperProps = isTouchable
              ? {
                  onPress: () => navigation.navigate(card.route),
                  activeOpacity: 0.85,
                }
              : {};
            return (
              <Wrapper
                key={card.id}
                style={styles.actionCard}
                {...wrapperProps}
              >
              <View style={[styles.actionIcon, { backgroundColor: card.badgeColor }] }>
                <SVGXml icon={card.icon} width={24} height={24} />
              </View>
              <View style={styles.actionTextBlock}>
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
                <AppText
                  title={card.description}
                  textColor={AppColors.GRAY}
                  textSize={1.4}
                  lineHeight={2.3}
                />
              </View>
              </Wrapper>
            );
          })}
        </View>

        <View style={styles.activityCard}>
          <AppText
            title="Community Activity"
            textColor={AppColors.BLACK}
            textFontWeight
            textAlignment="center"
          />
          <View style={styles.activityRow}>
            {activityStats.map((item, index) => (
              <View
                key={item.id}
                style={styles.activityItem}
              >
                <AppText
                  title={item.value}
                  textColor={AppColors.ThemeColor}
                  textFontWeight
                  textSize={index === 0 ? 3 : 2}
                />
                <AppText
                  title={item.label}
                  textColor={AppColors.DARKGRAY}
                  textSize={1.4}
                />
              </View>
            ))}
          </View>
        </View>
        </ScrollView>

        <SideMenuDrawer
          visible={isMenuOpen}
          onClose={() => setMenuOpen(false)}
          onSelect={handleMenuAction}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
    paddingBottom: responsiveHeight(12),
    gap: responsiveHeight(2.5),
  },
  heroBackground: {
    backgroundColor: '#0D7CF4',
    borderRadius: 24,
    padding: responsiveWidth(5),
    paddingBottom: responsiveHeight(3),
    overflow: 'hidden',
    gap: responsiveHeight(2),
  },
  heroAccent: {
    position: 'absolute',
    top: -responsiveHeight(8),
    right: -responsiveWidth(20),
    width: responsiveWidth(70),
    height: responsiveWidth(70),
    backgroundColor: '#2CA2FF',
    transform: [{ rotate: '35deg' }],
    opacity: 0.7,
    pointerEvents: 'none',
  },
  welcomeCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 16,
    padding: responsiveWidth(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    position: 'relative',
  },
  cardContent: {
    flex: 1,
    gap: responsiveHeight(0.5),
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    marginTop: responsiveHeight(0.5),
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0C6FE8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  menuLine: {
    width: 16,
    height: 2,
    borderRadius: 2,
    backgroundColor: AppColors.WHITE,
  },
  codeCard: {
    backgroundColor: '#E7F0FF',
    borderRadius: 18,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.6),
    borderWidth: 1,
    borderColor: '#C4DAFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  actionStack: {
    gap: responsiveHeight(1.8),
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E1E6F2',
    backgroundColor: AppColors.WHITE,
    shadowColor: '#9DB4D4',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
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
    gap: responsiveHeight(0.6),
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
