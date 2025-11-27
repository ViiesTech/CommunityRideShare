/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import AppButton from '../../../components/AppButton';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const OfferRide = () => {
  const navigation = useNavigation();
  const [from, setFrom] = useState('Downtown Plaza');
  const [to, setTo] = useState('Tech Park');
  const [rideDate, setRideDate] = useState(new Date('2025-05-24T07:45:00'));
  const [rideTime, setRideTime] = useState(new Date('2025-05-24T07:45:00'));
  const [seats, setSeats] = useState('3');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Camry');
  const [color, setColor] = useState('Silver');
  const [plate, setPlate] = useState('ABC123');
  const [iosPickerState, setIosPickerState] = useState({
    visible: false,
    mode: 'date',
    value: new Date(),
    target: 'date',
  });

  const formatDate = dateValue =>
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(dateValue);

  const formatTime = timeValue =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(timeValue);

  const applyDateChange = selectedDate => {
    if (!selectedDate) {
      return;
    }
    const normalized = new Date(selectedDate);
    normalized.setHours(0, 0, 0, 0);
    setRideDate(normalized);
  };

  const applyTimeChange = selectedDate => {
    if (!selectedDate) {
      return;
    }
    const normalized = new Date(selectedDate);
    normalized.setFullYear(1970, 0, 1);
    setRideTime(normalized);
  };

  const openPicker = type => {
    const currentValue = type === 'date' ? rideDate : rideTime;
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: type,
        value: currentValue,
        is24Hour: false,
        onChange: (event, selectedDate) => {
          if (event.type !== 'set' || !selectedDate) {
            return;
          }
          if (type === 'date') {
            applyDateChange(selectedDate);
          } else {
            applyTimeChange(selectedDate);
          }
        },
      });
      return;
    }

    setIosPickerState({
      visible: true,
      mode: type,
      value: currentValue,
      target: type,
    });
  };

  const handleIosChange = (_event, selectedDate) => {
    if (!selectedDate) {
      return;
    }
    setIosPickerState(prev => ({ ...prev, value: selectedDate }));
  };

  const handleIosCancel = () => {
    setIosPickerState(prev => ({ ...prev, visible: false }));
  };

  const handleIosConfirm = () => {
    if (iosPickerState.target === 'date') {
      applyDateChange(iosPickerState.value);
    } else {
      applyTimeChange(iosPickerState.value);
    }
    setIosPickerState(prev => ({ ...prev, visible: false }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <SVGXml icon={AppIcons.arrowLeft} width={20} height={20} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <AppText title="Offer a Ride" textColor={AppColors.BLACK} textFontWeight textSize={2.1} />
            <AppText
              title="Fill in the details of your upcoming trip"
              textColor={AppColors.DARKGRAY}
              textSize={1.4}
            />
          </View>
          <View style={{ width: responsiveWidth(10) }} />
        </View>

        <View style={styles.formCard}>
          <SectionHeading label="Route" icon={AppIcons.location} />
          <View style={styles.formGroup}>
            <AppText title="Origin" textColor={AppColors.BLACK} textSize={1.6} />
            <AppTextInput
              value={from}
              onChangeText={setFrom}
              containerBg={styles.inputBg.backgroundColor}
              borderColor="transparent"
              borderWidth={1}
              inputWidth={90}
            />
          </View>
          <View style={styles.formGroup}>
            <AppText title="Destination" textColor={AppColors.BLACK} textSize={1.6} />
            <AppTextInput
              value={to}
              onChangeText={setTo}
              containerBg={styles.inputBg.backgroundColor}
              borderColor="transparent"
              borderWidth={1}
              inputWidth={90}
            />
          </View>

          <SectionHeading label="Schedule" iconColor="#0D7CF4" icon={AppIcons.calendar} />
          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <AppText title="Date" textColor={AppColors.BLACK} textSize={1.6} />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => openPicker('date')}
                style={styles.touchableField}
              >
                <AppTextInput
                  value={formatDate(rideDate)}
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <AppText title="Time" textColor={AppColors.BLACK} textSize={1.6} />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => openPicker('time')}
                style={styles.touchableField}
              >
                <AppTextInput
                  value={formatTime(rideTime)}
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
          </View>

          <SectionHeading label="Available Seats" iconColor="#0D7CF4" icon={AppIcons.users} />
          <View style={styles.formGroup}>
            <AppText title="Seats" textColor={AppColors.BLACK} textSize={1.6} />
            <AppTextInput
              value={seats}
              onChangeText={setSeats}
              containerBg={styles.inputBg.backgroundColor}
              borderColor="transparent"
              borderWidth={1}
              inputWidth={28}
              keyboardType="numeric"
            />
          </View>

          <SectionHeading label="Car Information" iconColor="#0D7CF4" icon={AppIcons.car} />
          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <AppText title="Make" textColor={AppColors.BLACK} textSize={1.6} />
              <AppTextInput
                value={make}
                onChangeText={setMake}
                containerBg={styles.inputBg.backgroundColor}
                borderColor="transparent"
                borderWidth={1}
                inputWidth={42}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppText title="Model" textColor={AppColors.BLACK} textSize={1.6} />
              <AppTextInput
                value={model}
                onChangeText={setModel}
                containerBg={styles.inputBg.backgroundColor}
                borderColor="transparent"
                borderWidth={1}
                inputWidth={42}
              />
            </View>
          </View>
          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <AppText title="Color" textColor={AppColors.BLACK} textSize={1.6} />
              <AppTextInput
                value={color}
                onChangeText={setColor}
                containerBg={styles.inputBg.backgroundColor}
                borderColor="transparent"
                borderWidth={1}
                inputWidth={42}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppText title="License Plate" textColor={AppColors.BLACK} textSize={1.6} />
              <AppTextInput
                value={plate}
                onChangeText={setPlate}
                containerBg={styles.inputBg.backgroundColor}
                borderColor="transparent"
                borderWidth={1}
                inputWidth={42}
              />
            </View>
          </View>
        </View>

        <AppButton
          title="Post Ride"
          bgColor={AppColors.BLACK}
          handlePress={() => null}
          buttoWidth={90}
          borderRadius={16}
          textSize={1.9}
          loading={false}
          loaderSize="small"
        />

        {Platform.OS === 'ios' && (
          <Modal
            animationType="slide"
            transparent
            visible={iosPickerState.visible}
            onRequestClose={handleIosCancel}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.pickerSheet}>
                <View style={styles.pickerActions}>
                  <TouchableOpacity onPress={handleIosCancel}>
                    <AppText title="Cancel" textColor={AppColors.DARKGRAY} textSize={1.6} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleIosConfirm}>
                    <AppText title="Done" textColor={AppColors.ThemeColor} textFontWeight textSize={1.6} />
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={iosPickerState.value}
                  mode={iosPickerState.mode}
                  display="spinner"
                  onChange={handleIosChange}
                  style={{ backgroundColor: AppColors.WHITE }}
                  textColor={AppColors.BLACK}
                />
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
    gap: responsiveHeight(2.5),
    paddingBottom: responsiveHeight(4),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  formCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 24,
    padding: responsiveWidth(4),
    gap: responsiveHeight(1.6),
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  formGroup: {
    gap: responsiveHeight(1),
  },
  inlineRow: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
  },
  inputBg: {
    backgroundColor: '#F4F6FB',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    marginBottom: responsiveHeight(0.5),
  },
  headingIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F1FF',
  },
  touchableField: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.35)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: AppColors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: responsiveHeight(4),
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EC',
  },
});

const SectionHeading = ({ label, iconColor = '#0D7CF4', icon }) => (
  <View style={styles.headingRow}>
    <View style={styles.headingIcon}>
      {icon ? (
        <SVGXml icon={icon} width={18} height={18} />
      ) : (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: iconColor,
          }}
        />
      )}
    </View>
    <AppText title={label} textColor={iconColor} textFontWeight textSize={1.6} />
  </View>
);

export default OfferRide;
