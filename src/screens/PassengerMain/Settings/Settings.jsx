import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppText';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const settingsItems = [
  { id: 'security', label: 'Security', type: 'link', route: 'Security' },
  { id: 'notification', label: 'Notification', type: 'toggle' },
  { id: 'help', label: 'Help / FAQ', type: 'link', route: 'DocumentInfo', params: { type: 'help' } },
  { id: 'terms', label: 'Terms of use', type: 'link', route: 'DocumentInfo', params: { type: 'terms' } },
  { id: 'privacy', label: 'Privacy Policy', type: 'link', route: 'DocumentInfo', params: { type: 'privacy' } },
];

const Settings = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()}>
            <SVGXml icon={AppIcons.arrowLeft} width={18} height={18} />
          </TouchableOpacity>
          <AppText title="Settings" textColor={AppColors.BLACK} textFontWeight textSize={2.3} />
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.listCard}>
          {settingsItems.map((item, index) => {
            const isLast = index === settingsItems.length - 1;
            const isToggle = item.type === 'toggle';

            const RowComponent = isToggle ? View : TouchableOpacity;
            const rowProps = isToggle
              ? {}
              : {
                activeOpacity: 0.8,
                onPress: () => {
                  if (item.route) {
                    navigation.navigate(item.route, item.params);
                  }
                },
              };

            return (
              <React.Fragment key={item.id}>
                <RowComponent style={styles.row} {...rowProps}>
                  <AppText title={item.label} textColor={AppColors.BLACK} textSize={1.7} />
                  {isToggle ? (
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: '#DADFE8', true: '#0D7CF4' }}
                      thumbColor={AppColors.WHITE}
                    />
                  ) : (
                    <SVGXml icon={AppIcons.arrowRight} width={14} height={14} />
                  )}
                </RowComponent>
                {!isLast && <View style={styles.rowDivider} />}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  content: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2.5),
    gap: responsiveHeight(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 18,
  },
  listCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 18,
    paddingHorizontal: responsiveWidth(3),
    borderWidth: 1,
    borderColor: '#E4E7EE',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.8),
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EC',
  },
});

export default Settings;
