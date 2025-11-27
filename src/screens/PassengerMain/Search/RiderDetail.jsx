import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const stopData = [
  {
    label: 'Mall Central',
    icon: AppIcons.locationGreen,
    accent: '#0AA64F',
  },
  {
    label: 'University Campus',
    icon: AppIcons.locationRed,
    accent: '#FF4D4D',
  },
];

const mapBackground = require('../../../assets/images/map_bg.png');

const RiderDetail = () => {
  const navigation = useNavigation();
  const [stops, setStops] = React.useState(
    stopData.map(stop => ({ ...stop, value: stop.label })),
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('WaitingConfirmation');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleStopChange = (index, text) => {
    setStops(prev => {
      const next = [...prev];
      next[index] = { ...next[index], value: text };
      return next;
    });
  };

  return (
    <ImageBackground
      source={mapBackground}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? responsiveHeight(2) : responsiveHeight(1)}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.screenContent}>
              <View style={styles.topSection}>
                <View style={styles.headerRow}>
                  <TouchableOpacity style={[styles.headerButton, styles.backButton]} onPress={() => navigation.goBack()}>
                    <SVGXml icon={AppIcons.arrowLeft} width={20} height={20} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.headerButton, styles.menuButton]}>
                    <SVGXml icon={AppIcons.menuHamburger} width={20} height={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.routeCard}>
                  <View style={styles.routeIndicatorColumn}>
                    <View style={styles.indicatorTop} />
                    <View style={styles.indicatorLine} />
                    <View style={styles.indicatorBottom} />
                  </View>
                  <View style={styles.routeStops}>
                    {stops.map((stop, index) => (
                      <View key={stop.label} style={styles.stopInputWrap}>
                        <AppTextInput
                          inputPlaceHolder={stop.label}
                          value={stop.value}
                          onChangeText={text => handleStopChange(index, text)}
                          containerBg={AppColors.WHITE}
                          borderRadius={18}
                          borderColor="#E8ECF5"
                          borderWidth={1}
                          inputWidth={50}
                          textAlign="left"
                          placeholderTextColor={AppColors.BLACK}
                          rightIcon={(
                            <View style={styles.stopActions}>
                              <TouchableOpacity style={[styles.stopIcon, styles.searchIcon]}>
                                <SVGXml icon={AppIcons.search} width={16} height={16} />
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.stopIcon, styles.stopIconBordered, { backgroundColor: `${stop.accent}1A`, borderColor: stop.accent }] }>
                                <SVGXml icon={stop.icon} width={16} height={16} />
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.driverCard}>
            <View style={styles.cardHeader}>
              <View style={styles.profileColumn}>
                <Image source={{ uri: 'https://i.pravatar.cc/150?img=32' }} style={styles.avatar} />
                <View style={styles.ratingRow}>
                  <View style={styles.starCircle}>
                    <SVGXml icon={AppIcons.starFilled} width={18} height={18} />
                  </View>
                  <AppText title="5.0" textColor={AppColors.WHITE} textFontWeight textSize={1.5} />
                </View>
              </View>
              <View style={styles.headerContent}>
                <View style={styles.headerTop}>
                  <View style={styles.nameRow}>
                    <AppText title="Leilani Angel" textColor={AppColors.WHITE} textFontWeight textSize={1.8} />
                    <AppText title="(Level 3 Rider)" textColor="rgba(255,255,255,0.85)" textSize={1.2} />
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity style={styles.contactButton}>
                      <SVGXml icon={AppIcons.phoneSolid} width={16} height={16} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactButton}>
                      <SVGXml icon={AppIcons.messageSolid} width={16} height={16} />
                    </TouchableOpacity>
                  </View>
                </View>
                <AppText title="leilaniangel@gmail.com" textColor={AppColors.WHITE} textSize={1.3} />
                <AppText title="Phone : +12 345 6789" textColor={AppColors.WHITE} textSize={1.3} />
              </View>
            </View>
            <View style={styles.driverInfoRow}>
              <AppText title="Car Type" textColor={AppColors.GRAY} textSize={1.3} />
              <AppText title="Honda HRV" textColor={AppColors.BLACK} textFontWeight textSize={1.4} />
            </View>
            <View style={styles.driverInfoRow}>
              <AppText title="Car Seat" textColor={AppColors.GRAY} textSize={1.3} />
              <AppText title="3/4 Seats Available" textColor={AppColors.BLACK} textFontWeight textSize={1.4} />
            </View>
            <View style={styles.driverInfoRow}>
              <AppText title="Time & Date" textColor={AppColors.GRAY} textSize={1.3} />
              <AppText title="Mon, Jan 15, 9:30 AM" textColor={AppColors.BLACK} textFontWeight textSize={1.4} />
            </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: responsiveHeight(2.5),
  },
  screenContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: responsiveHeight(2),
  },
  topSection: {
    gap: responsiveHeight(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  backButton: {
  },
  menuButton: {
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.WHITE,
    borderRadius: 24,
    padding: responsiveWidth(4),
    alignItems: 'center',
    gap: responsiveWidth(4),
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: responsiveHeight(2.5),
  },
  routeIndicatorColumn: {
    alignItems: 'center',
    gap: 0,
  },
  indicatorTop: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1DAF65',
  },
  indicatorLine: {
    width: 3,
    height: responsiveHeight(6),
    backgroundColor: '#DFE6F5',
    borderRadius: 4,
  },
  indicatorBottom: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4D4D',
  },
  routeStops: {
    flex: 1,
    gap: responsiveHeight(1.2),
  },
  stopInputWrap: {
    width: '100%',
  },
  stopIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopActions: {
    flexDirection: 'row',
    gap: responsiveWidth(1.5),
  },
  searchIcon: {
    backgroundColor: '#E7EEFF',
  },
  stopIconBordered: {
    borderWidth: 1,
  },
  driverCard: {
    marginTop: responsiveHeight(2.5),
    borderRadius: 26,
    backgroundColor: AppColors.WHITE,
    padding: responsiveWidth(4),
    gap: responsiveHeight(1.4),
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  cardHeader: {
    backgroundColor: '#0D7CF4',
    borderRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2.2),
    flexDirection: 'row',
    gap: responsiveWidth(3),
    alignItems: 'flex-start',
    marginHorizontal: -responsiveWidth(4),
    marginTop: -responsiveWidth(4),
  },
  profileColumn: {
    alignItems: 'center',
    gap: responsiveHeight(0.6),
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1),
  },
  starCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: responsiveHeight(0.3),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: responsiveWidth(2),
    position: 'relative',
    paddingRight: responsiveWidth(8),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1.5),
    flexShrink: 1,
  },
  contactActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: responsiveHeight(1),
    position: 'absolute',
    right: 0,
    top: 0,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: AppColors.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  driverInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RiderDetail;
