import React from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppColors from '../utils/AppColors';
import AppText from './AppText';
import SVGXml from './SVGXML';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import { AppIcons } from '../assets/icons';

const drawerWidth = responsiveWidth(72);

const primaryMenu = [
  { id: 'home', label: 'Home', icon: AppIcons.fourBlocks },
  { id: 'myRide', label: 'My Ride', icon: AppIcons.ride },
  { id: 'settings', label: 'Settings', icon: AppIcons.setting },
  { id: 'help', label: 'Help', icon: AppIcons.help },
];

const SideMenuDrawer = ({ visible, onClose, onSelect }) => {
  const animation = React.useRef(new Animated.Value(0)).current;
  const [portalVisible, setPortalVisible] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setPortalVisible(true);
    }

    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      if (!visible) {
        setPortalVisible(false);
      }
    });
  }, [visible, animation]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-drawerWidth, 0],
  });

  const overlayOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  const handleSelect = id => {
    if (onSelect) {
      onSelect(id);
    }
  };

  if (!portalVisible) {
    return null;
  }

  return (
    <Modal transparent visible={portalVisible} animationType="none" onRequestClose={onClose}>
      <View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFillObject, styles.overlayRoot]}
      >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX }] }]}
      >
        <TouchableOpacity
          style={styles.drawerHeader}
          activeOpacity={0.85}
          onPress={() => handleSelect('editProfile')}
        >
          <View style={styles.headerLeft}>
            <View style={styles.avatarBadge}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=16' }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.headerTextBlock}>
              <AppText
                title="Alex Morgan"
                textColor={AppColors.WHITE}
                textFontWeight
                textSize={1.9}
              />
              <AppText
                title="Edit Profile"
                textColor="#CFE5FF"
                textSize={1.3}
              />
            </View>
          </View>
          <View style={styles.headerArrowWrap}>
            <SVGXml icon={AppIcons.arrowRightWhite} width={16} height={16} />
          </View>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        <View style={styles.menuList}>
          {primaryMenu.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuRow}
              activeOpacity={0.85}
              onPress={() => handleSelect(item.id)}
            >
              <View style={styles.iconWrap}>
                <SVGXml icon={item.icon} width={22} height={22} />
              </View>
              <AppText
                title={item.label}
                textColor={AppColors.BLACK}
                textFontWeight
                textSize={1.7}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutDivider} />

        <View style={styles.logoutBlock}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={() => handleSelect('logout')}
          >
            <View style={styles.logoutIconWrap}>
              <SVGXml icon={AppIcons.logout} width={18} height={18} />
            </View>
            <AppText
              title="Logout"
              textColor={AppColors.WHITE}
              textFontWeight
              textSize={1.6}
            />
            <View style={styles.logoutArrowWrap}>
              <SVGXml icon={AppIcons.arrowRightWhite} width={14} height={14} />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0B1A39',
  },
  overlayRoot: {
    zIndex: 999,
    elevation: 20,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: drawerWidth,
    backgroundColor: AppColors.WHITE,
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(4),
    paddingBottom: responsiveHeight(5),
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  drawerHeader: {
    backgroundColor: '#0D7CF4',
    borderRadius: 24,
    padding: responsiveWidth(4),
    flexDirection: 'row',
    gap: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
    flex: 1,
  },
  avatarBadge: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  headerTextBlock: {
    flex: 1,
  },
  headerArrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDivider: {
    marginTop: responsiveHeight(2),
    borderBottomWidth: 1,
    borderColor: '#D7E2F5',
  },
  menuList: {
    marginTop: responsiveHeight(2),
    gap: responsiveHeight(1.5),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.6),
    borderRadius: 18,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#F4F7FF',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E7F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutDivider: {
    marginTop: responsiveHeight(3),
    borderBottomWidth: 1,
    borderColor: '#D7E2F5',
  },
  logoutBlock: {
    marginTop: responsiveHeight(2),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B1A39',
    borderRadius: 24,
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(4),
    gap: responsiveWidth(2.5),
  },
  logoutIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutArrowWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SideMenuDrawer;
