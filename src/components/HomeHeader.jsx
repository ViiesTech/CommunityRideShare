import React from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import SVGXml from './SVGXML';
import { AppIcons } from '../assets/icons';
import { AppImages } from '../assets/images';
import AppColors from '../utils/AppColors';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeHeader = ({ userName, communityName, communityCode }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={AppImages.headerBG}
        style={[styles.bgImage,
        { paddingTop: insets.top + responsiveHeight(1.5) }
        ]}
        resizeMode="cover"
      >
        <View style={styles.topRow}>
          <View style={styles.userInfoCard}>
            <AppText
              title={`Welcome, ${userName}`}
              textFontWeight
              textSize={1.8}
              textColor={AppColors.BLACK}
            />
            <View style={styles.communityRow}>
              <SVGXml icon={AppIcons.users} width={16} height={16} />
              <AppText
                title={communityName}
                textColor={AppColors.ThemeColor}
                textSize={1.5}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.85}
          >
            <SVGXml icon={AppIcons.menuHamburger} width={responsiveWidth(9)} height={responsiveWidth(14)} />
          </TouchableOpacity>
        </View>

        {/* Code Card Overlapping the bottom edge */}
        <View style={styles.codeCardWrapper}>
          <View style={styles.codeCard}>
            <TouchableOpacity
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              activeOpacity={0.7}
              onLongPress={() => {
                Clipboard.setString(communityCode);
                Toast.show({
                  type: 'success',
                  text1: 'Copied',
                  text2: 'Community code copied.',
                });
              }}
            >
              <AppText
                title={`Community Code: `}
                textColor={AppColors.darkGray}
                textSize={1.6}
                textAlignment="center"
              />
              <AppText
                title={communityCode}
                textFontWeight
                textColor={AppColors.darkGray}
                textSize={1.7}
              />
            </TouchableOpacity>
            <AppText
              title="Share this code with others to invite them"
              textColor={AppColors.darkGray}
              textSize={1.6}
              textAlignment="center"
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(),
  },
  bgImage: {
    width: responsiveWidth(),
    paddingBottom: responsiveHeight(5.2), // Space before the overlapping card starts
  },
  topRow: {
    width: responsiveWidth(95),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  userInfoCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(2),
    flex: 1,
    marginRight: responsiveWidth(3),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(0.5),
    gap: responsiveWidth(1.5),
  },
  menuButton: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveHeight(3),
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  codeCardWrapper: {
    width: responsiveWidth(95),
    alignSelf: "center",
    position: 'absolute',
    bottom: -responsiveHeight(7), // Push half of the card out of the blue bg
    zIndex: 10,
  },
  codeCard: {
    backgroundColor: '#F5F8FF',
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(3.5),
    paddingHorizontal: responsiveWidth(4),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});

export default HomeHeader;
