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
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';

const toggleItems = [
  { id: 'faceId', label: 'Face ID' },
  { id: 'rememberMe', label: 'Remember me' },
  { id: 'biometricId', label: 'Biometric ID' },
];

const Security = () => {
  const navigation = useNavigation();
  const [securityPrefs, setSecurityPrefs] = React.useState({
    faceId: true,
    rememberMe: true,
    biometricId: true,
  });

  const handleToggle = React.useCallback((key, value) => {
    setSecurityPrefs(prev => ({ ...prev, [key]: value }));
  }, []);

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
          <AppText title="Security" textColor={AppColors.BLACK} textFontWeight textSize={2.2} />
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.listCard}>
          {toggleItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <View style={styles.row}>
                <AppText title={item.label} textColor={AppColors.BLACK} textSize={1.7} />
                <Switch
                  value={securityPrefs[item.id]}
                  onValueChange={value => handleToggle(item.id, value)}
                  trackColor={{ false: '#DADFE8', true: '#0D7CF4' }}
                  thumbColor={AppColors.WHITE}
                />
              </View>
              {index !== toggleItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}

          <View style={styles.divider} />

          <RNGHTouchableOpacity style={styles.row} activeOpacity={0.85} onPress={() => {}}>
            <AppText title="Google Authenticator" textColor={AppColors.BLACK} textSize={1.7} />
            <SVGXml icon={AppIcons.arrowRight} width={14} height={14} />
          </RNGHTouchableOpacity>
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
    marginTop: responsiveHeight(1),
    backgroundColor: AppColors.WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4E7EE',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    paddingHorizontal: responsiveWidth(3),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.8),
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EC',
  },
});

export default Security;
