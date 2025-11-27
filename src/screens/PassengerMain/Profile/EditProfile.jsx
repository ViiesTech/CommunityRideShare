import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppText';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const nameField = { id: 'name', label: 'Full Name', placeholder: 'Anastasia Sya' };

const fields = [
  { id: 'phone', label: 'Phone Number', placeholder: '123 456 789', keyboardType: 'phone-pad' },
  { id: 'email', label: 'Email', placeholder: 'AnastasiaSya@gmail.com', keyboardType: 'email-address' },
];

const formatDate = date => {
  if (!date) {
    return '';
  }
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const initialDob = new Date(1989, 1, 28);
const initialAvatarUri = 'https://i.pravatar.cc/200?img=47';

const initialValues = {
  name: 'Anastasia Sya',
  dob: formatDate(initialDob),
  phone: '123 456 789',
  email: 'AnastasiaSya@gmail.com',
  about: '',
};

const imagePickerOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  quality: 0.85,
};

const EditProfile = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = React.useState(initialValues);
  const [dobDate, setDobDate] = React.useState(initialDob);
  const [showDobPicker, setShowDobPicker] = React.useState(false);
  const [avatarUri, setAvatarUri] = React.useState(initialAvatarUri);

  const handleChange = React.useCallback((fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const openDobPicker = React.useCallback(() => {
    setShowDobPicker(true);
  }, []);

  const closeDobPicker = React.useCallback(() => {
    setShowDobPicker(false);
  }, []);

  const handleDobChange = React.useCallback(
    (_, selectedDate) => {
      if (Platform.OS === 'android') {
        setShowDobPicker(false);
      }

      if (selectedDate) {
        setDobDate(selectedDate);
        handleChange('dob', formatDate(selectedDate));
      }
    },
    [handleChange],
  );

  const handleSelectAvatar = React.useCallback(() => {
    launchImageLibrary(imagePickerOptions, response => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setAvatarUri(asset.uri);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <SVGXml icon={AppIcons.arrowLeft} width={18} height={18} />
            </TouchableOpacity>
            <AppText title="Edit Profile" textColor={AppColors.BLACK} textFontWeight textSize={2.3} />
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.avatarBlock}>
            <View style={styles.avatarShell}>
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSelectAvatar}>
              <AppText title="Change Avatar" textColor={AppColors.ThemeColor} textFontWeight textSize={1.7} />
            </TouchableOpacity>
          </View>

          <FormField
            {...nameField}
            value={formData[nameField.id]}
            onChangeText={text => handleChange(nameField.id, text)}
          />

          <DatePickerField
            label="Date of Birth"
            value={formData.dob}
            onPress={openDobPicker}
          />

          {fields.map(field => (
            <FormField
              key={field.id}
              {...field}
              value={formData[field.id]}
              onChangeText={text => handleChange(field.id, text)}
            />
          ))}

          <FormField
            label="About"
            placeholder="Tell others about you"
            multiline
            large
            value={formData.about}
            onChangeText={text => handleChange('about', text)}
          />

          <View style={styles.labelRow}>
            <AppText title="Select ID" textColor={AppColors.BLACK} textFontWeight textSize={1.8} />
          </View>
          <View style={styles.dropdownField}>
            <AppText title="Personal ID" textColor={AppColors.BLACK} textFontWeight textSize={1.7} />
            <View style={styles.dropdownRight}>
              <View style={styles.dropdownCheck}>
                <View style={styles.dropdownDot} />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} activeOpacity={0.85}>
            <AppText title="Update" textColor={AppColors.WHITE} textFontWeight textAlignment="center" textSize={1.9} />
          </TouchableOpacity>

          {showDobPicker && Platform.OS === 'ios' && (
            <View style={styles.iosPickerSheet}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity activeOpacity={0.85} onPress={closeDobPicker}>
                  <AppText title="Done" textColor={AppColors.ThemeColor} textFontWeight textSize={1.7} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dobDate}
                mode="date"
                display="spinner"
                onChange={handleDobChange}
                maximumDate={new Date()}
                style={styles.iosPicker}
              />
            </View>
          )}

          {showDobPicker && Platform.OS !== 'ios' && (
            <DateTimePicker
              value={dobDate}
              mode="date"
              display="calendar"
              onChange={handleDobChange}
              maximumDate={new Date()}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const FormField = ({ label, placeholder, multiline, large, keyboardType, value, onChangeText }) => (
  <View style={styles.fieldBlock}>
    <AppText title={label} textColor={AppColors.BLACK} textFontWeight textSize={1.8} />
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline, large && styles.inputLarge]}
      placeholder={placeholder}
      placeholderTextColor={AppColors.DARKGRAY}
      multiline={multiline}
      keyboardType={keyboardType}
      textAlignVertical={multiline ? 'top' : 'center'}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const DatePickerField = ({ label, value, onPress }) => (
  <View style={styles.fieldBlock}>
    <AppText title={label} textColor={AppColors.BLACK} textFontWeight textSize={1.8} />
    <TouchableOpacity
      style={[styles.input, styles.dateInput]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <AppText
        title={value || 'Select date'}
        textColor={value ? AppColors.BLACK : AppColors.DARKGRAY}
        textSize={1.7}
      />
      <SVGXml icon={AppIcons.calendar} width={20} height={20} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(6),
    paddingTop: responsiveHeight(3),
    gap: responsiveHeight(2.2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.WHITE,
  },
  headerSpacer: {
    width: 44,
  },
  avatarBlock: {
    alignItems: 'center',
    gap: responsiveHeight(1),
    marginTop: responsiveHeight(1),
  },
  avatarShell: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#0D7CF4',
    padding: 6,
    backgroundColor: AppColors.WHITE,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
  },
  labelRow: {
    marginTop: responsiveHeight(1),
  },
  fieldBlock: {
    gap: responsiveHeight(0.8),
  },
  input: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: AppColors.WHITE,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.8),
    fontSize: responsiveWidth(4),
    color: AppColors.BLACK,
    borderWidth: 1,
    borderColor: '#E7E9F2',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputMultiline: {
    minHeight: responsiveHeight(12),
  },
  inputLarge: {
    height: responsiveHeight(16),
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownField: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: AppColors.WHITE,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E6E7EC',
  },
  dropdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  dropdownCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: AppColors.ThemeColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.WHITE,
  },
  dropdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.ThemeColor,
  },
  submitButton: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: responsiveHeight(1.6),
    alignItems: 'center',
  },
  iosPickerSheet: {
    marginTop: responsiveHeight(2),
    borderRadius: 22,
    backgroundColor: AppColors.WHITE,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.4),
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: '#EFF1F7',
  },
  iosPicker: {
    backgroundColor: AppColors.WHITE,
  },
});

export default EditProfile;
