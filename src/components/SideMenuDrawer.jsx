import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import AppColors from '../utils/AppColors';
import AppText from './AppText';
import SVGXml from './SVGXML';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import { AppIcons } from '../assets/icons';
import { persistor, store } from '../redux/store';
import { selectCurrentUser } from '../redux/slices/authSlice';

const primaryMenu = [
  { id: 'home', label: 'Home', icon: AppIcons.fourBlocks },
  { id: 'myRide', label: 'My ride', icon: AppIcons.ride },
  { id: 'settings', label: 'Settings', icon: AppIcons.setting },
  { id: 'help', label: 'Help', icon: AppIcons.help },
];


const SideMenuDrawer = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const logout = async () => {
    // 0) Drawer close pehle
    // props.navigation.closeDrawer();

    // // 1) Immediately Redux clear (UI will switch to NA quickly)
    store.dispatch({ type: 'RESET_STORE' });

    // // 2) Persisted storage purge (async)
    await persistor.purge();

    // // 3) Auth stack pe le jao
    // props.navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Auth' }],
    // });
  };

  const handleSelect = id => {
    if (id === 'logout') {
      logout()
      return;
    }

    // Tab screens are inside Drawer > MainTabs
    const tabScreens = { home: 'Home' };
    // Stack screens are in parent HomeStack (outside Drawer)
    const stackScreens = { myRide: 'Calendar', settings: 'Settings', help: 'FAQs', editProfile: 'EditProfile' };

    if (tabScreens[id]) {
      props.navigation.navigate('MainTabs', { screen: tabScreens[id] });
    } else if (stackScreens[id]) {
      props.navigation.getParent()?.navigate(stackScreens[id]);
    }

    // Auto-close drawer after selection
    if (id !== 'logout') {
      props.navigation.closeDrawer();
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawer}
      scrollEnabled={false}
    >
      <View style={styles.container}>

        {/* Top Section */}
        <View>
          {/* Header */}
          <TouchableOpacity
            style={styles.headerArea}
            activeOpacity={0.85}
            onPress={() => handleSelect('editProfile')}
          >
            <View style={styles.headerLeft}>
              <View style={styles.avatarIconCircle}>
                {
                  user?.avatarUrl ? (
                    <Image
                      source={{ uri: user?.avatarUrl }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons
                      name="person-sharp"
                      size={responsiveHeight(3.5)}
                      color={AppColors.WHITE}
                    />
                  )
                }
              </View>
              <View style={styles.headerTextBlock}>
                <AppText
                  title={user?.name ? user?.name : 'NA'}
                  textColor={AppColors.BLACK}
                  textFontWeight
                  textSize={1.9}
                />
                <AppText
                  title="Edit Profile"
                  textColor="#A1A4B2" // Light gray color from image
                  textSize={1.4}
                />
              </View>
            </View>
            <View style={styles.arrowWrap}>
              <SVGXml icon={AppIcons.arrowRight} width={18} height={18} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Menu Items */}
          <View style={styles.menuList}>
            {primaryMenu.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuRow, index === 0 && { marginTop: 0 }]}
                activeOpacity={0.85}
                onPress={() => handleSelect(item.id)}
              >
                <View style={styles.iconWrap}>
                  <SVGXml icon={item.icon} width={24} height={24} />
                </View>
                <AppText
                  title={item.label}
                  textColor={'#333333'}
                  textFontWeight
                  textSize={1.7}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Section */}
        <View>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={() => handleSelect('logout')}
          >
            <View style={styles.logoutLeft}>
              <View style={styles.logoutIconCircle}>
                <SVGXml icon={AppIcons.logout} width={20} height={20} />
              </View>
              <AppText
                title="Logout"
                textColor={AppColors.BLACK}
                textFontWeight
                textSize={1.8}
              />
            </View>
            <View style={styles.arrowWrap}>
              <SVGXml icon={AppIcons.arrowRight} width={18} height={18} />
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(4),
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(2),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: responsiveHeight(6.5),
    height: responsiveHeight(6.5),
    borderRadius: responsiveHeight(3.25),
  },
  avatarIconCircle: {
    width: responsiveHeight(5.5),
    height: responsiveHeight(5.5),
    borderRadius: responsiveHeight(3.25),
    backgroundColor: AppColors.ThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextBlock: {
    marginLeft: responsiveWidth(3.5),
    justifyContent: 'center',
  },
  arrowWrap: {
    opacity: 0.5, // To make the arrow look a bit gray/subtle like in the image
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: responsiveHeight(2),
  },
  menuList: {
    marginTop: responsiveHeight(1),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(2),
  },
  iconWrap: {
    width: responsiveWidth(10), // Ensures fixed width for icon column
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1),
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIconCircle: {
    width: responsiveHeight(5.5),
    height: responsiveHeight(5.5),
    borderRadius: responsiveHeight(2.75),
    backgroundColor: '#0D7CF4', // Blue color like in the image
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(4),
  },
});

export default SideMenuDrawer;
