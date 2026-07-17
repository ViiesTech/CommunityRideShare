import React from 'react';
import {
  Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View,
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
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setUser } from '../../../redux/slices/authSlice';
import Wrapper from '../../../components/Wrapper';
import AppHeader from '../../../components/AppHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../../components/AppButton';
import moment from "moment";
import { showToast } from '../../../utils/toast';
import { useUpdateProfileMutation } from '../../../redux/api/apiSlice';
import AppKeyboardAvoidingView from '../../../components/AppKeyboardAvoidingView';

const formatDate = date => {
  if (!date) {
    return '';
  }
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const initialValues = {
  name: '',
  phone: '',
  email: '',
  about: '',
};

const imagePickerOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  quality: 0.85,
};

const EditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser)
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [formData, setFormData] = React.useState(initialValues);
  const [dobDate, setDobDate] = React.useState(null);
  const [showDobPicker, setShowDobPicker] = React.useState(false);
  const [avatarUri, setAvatarUri] = React.useState('');
  const [avatarFile, setAvatarFile] = React.useState(null);

  const originalRef = React.useRef({
    name: '',
    phone: '',
    email: '',
    about: '',
    dob: null,
    avatar: '',
  });

  React.useEffect(() => {
    if (!user) return;

    const userDob = user?.dOB ? new Date(user.dOB) : null;

    setDobDate(userDob);
    setFormData({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      about: user?.about ?? '',
    });

    if (user?.avatarUrl) {
      setAvatarUri(user.avatarUrl);
      setAvatarFile(null);
    }

    originalRef.current = {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      about: user?.about ?? '',
      dob: userDob ? userDob.toISOString() : null,
      avatar: user?.avatarUrl ?? '',
    };
  }, [user]);

  const handleChange = React.useCallback((fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const openDobPicker = React.useCallback(() => {
    setShowDobPicker(true);
  }, []);

  const closeDobPicker = React.useCallback(() => {
    setShowDobPicker(false);
  }, []);

  const handleDobChange = (_, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDobPicker(false);
    }

    if (selectedDate) {
      setDobDate(selectedDate);
    }
  };

  const handleSelectAvatar = React.useCallback(() => {
    launchImageLibrary(imagePickerOptions, response => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setAvatarUri(asset.uri);
        setAvatarFile({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `avatar_${Date.now()}.jpg`,
        });
      }
    });
  }, []);

  const hasProfileChanged = () => {
    const original = originalRef.current;

    const currentDobISO = dobDate ? dobDate.toISOString() : null;

    if (formData.name !== original.name) return true;
    if (formData.phone !== original.phone) return true;
    if (formData.about !== original.about) return true;
    if (currentDobISO !== original.dob) return true;

    // avatar change hua?
    if (avatarFile) return true;

    return false;
  };

  const handleContinue = async () => {
    try {

      if (!hasProfileChanged()) {
        navigation.goBack()
        return
      }

      const multipart = new FormData();
      const dobISO = dobDate ? moment(dobDate).toISOString() : null;

      multipart.append('name', formData.name);
      multipart.append('dOB', dobISO);
      multipart.append('phone', formData.phone);
      multipart.append('about', formData.about);
      if (avatarFile) {
        multipart.append('avatar', avatarFile);
      }
      const response = await updateProfile(multipart).unwrap();
      if (response?.success) {
        dispatch(setUser(response?.data?.user));
        showToast(
          'success',
          'Congratulations',
          response?.message || 'Your profile has been updated successfully.',
          () => { navigation.goBack() });
      } else {
        showToast(
          'error',
          response?.errorCode || 'Profile Update Failed',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err) {
      showToast(
        'error',
        err?.data?.errorCode || 'Profile Update Failed',
        err?.data?.message || 'Something went wrong'
      );
    }
  };

  return (
    <Wrapper style={styles.safeArea} paddingHorizontal={false}>
      <AppHeader title="Edit Profile" paddingHorizontal={true} />
      <AppKeyboardAvoidingView contentContainerStyle={styles.content}>
        <View style={styles.avatarBlock}>
          {
            avatarUri ? (
              <Image
                source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={styles.avatarIconView}>
                <Ionicons name="person-sharp" size={responsiveWidth(20)} color={AppColors.WHITE} />
              </View>
            )
          }
          <TouchableOpacity activeOpacity={0.8} onPress={handleSelectAvatar}>
            <AppText title="Change Avatar" textColor={AppColors.ThemeColor} textFontWeight textSize={1.7} />
          </TouchableOpacity>
        </View>
        <FormField
          label="Full Name"
          placeholder="Enter your name"
          value={formData.name}
          onChangeText={text => handleChange('name', text)}
        />
        <DatePickerField
          label="Date of Birth"
          value={dobDate ? formatDate(dobDate) : ''}
          onPress={openDobPicker}
        />
        <FormField
          label="Phone Number"
          placeholder="123 456 789"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={text => handleChange('phone', text)}
        />
        <FormField
          label="Email"
          placeholder="Email"
          value={formData.email}
          disabled
        />
        <FormField
          label="About"
          placeholder="Tell others about you"
          multiline
          large
          value={formData.about}
          onChangeText={text => handleChange('about', text)}
        />
        <AppButton title={'Update'} bgColor={AppColors.BLACK} handlePress={handleContinue} loading={isLoading} />
        {showDobPicker && Platform.OS === 'ios' && (
          <View style={styles.iosPickerSheet}>
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity activeOpacity={0.85} onPress={closeDobPicker}>
                <AppText title="Done" textColor={AppColors.ThemeColor} textFontWeight textSize={1.7} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={dobDate ?? new Date()}
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
            value={dobDate ?? new Date()}
            mode="date"
            display="calendar"
            onChange={handleDobChange}
            maximumDate={new Date()}
          />
        )}
      </AppKeyboardAvoidingView>
    </Wrapper>
  );
};

const FormField = ({ label, placeholder, multiline, large, keyboardType, value, onChangeText, disabled = false }) => (
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
      editable={!disabled}
    />
  </View>
);

const DatePickerField = ({ label, value, onPress }) => (
  <View style={styles.fieldBlock}>
    <AppText title={label} textColor={AppColors.BLACK} textFontWeight textSize={1.8} />
    <TouchableOpacity
      style={[styles.input, styles.dateInput]}
      activeOpacity={0.85}
      onPress={onPress}>
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

  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(3),
    backgroundColor: AppColors.grayBG,
    flexGrow: 1,
    gap: responsiveHeight(3),
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
    width: responsiveWidth(31),
    height: responsiveWidth(31),
    borderRadius: responsiveWidth(40),
  },
  avatarIconView: {
    width: responsiveWidth(31),
    height: responsiveWidth(31),
    borderRadius: responsiveWidth(80),
    backgroundColor: AppColors.appBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    marginTop: responsiveHeight(1),
  },
  fieldBlock: {
    gap: responsiveHeight(0.8),
  },
  input: {
    width: responsiveWidth(),
    borderRadius: responsiveWidth(2),
    backgroundColor: AppColors.WHITE,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.8),
    fontSize: responsiveWidth(4),
    color: AppColors.BLACK,
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
