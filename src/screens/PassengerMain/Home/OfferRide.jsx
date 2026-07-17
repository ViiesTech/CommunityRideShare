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
import Wrapper from '../../../components/Wrapper';
import AppHeader from '../../../components/AppHeader';
import BoxShadow from '../../../components/BoxShadow';
import AppKeyboardAvoidingView from '../../../components/AppKeyboardAvoidingView';

const OfferRide = () => {
  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rideDate, setRideDate] = useState(null);
  const [rideTime, setRideTime] = useState(null);
  const [seats, setSeats] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
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
    const currentValue = (type === 'date' ? rideDate : rideTime) || new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: type,
        value: currentValue,
        minimumDate: type === 'date' ? new Date() : undefined,
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
    <Wrapper bgColor={AppColors.grayBG} >
      <AppHeader title='Offer a Ride' description={`Fill in the details of your upcoming trip`} />
      <AppKeyboardAvoidingView isScrollable={true} contentContainerStyle={styles.keyboardScrollContent}>
        <BoxShadow scroll={false} style={styles.formCard}        >
          <View style={styles.formGroup}>
            <SectionHeading label="Route" icon={AppIcons.location} />
            <AppText title="Origin" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
            <AppTextInput
              value={from}
              onChangeText={setFrom}
              inputPlaceHolder="Enter origin"
              containerBg={styles.inputBg.backgroundColor}
              borderColor="transparent"
              borderWidth={1}
              inputWidth={90}
            />
            <View style={styles.formGroup}>
              <AppText title="Destination" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
              <AppTextInput
                value={to}
                onChangeText={setTo}
                inputPlaceHolder="Enter destination"
                containerBg={styles.inputBg.backgroundColor}
                borderColor="transparent"
                borderWidth={1}
                inputWidth={90}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <SectionHeading label="Schedule" iconColor="#0D7CF4" icon={AppIcons.calendar} />
            <View style={styles.inlineRow}>
              <View style={{ flex: 1, gap: responsiveWidth(1), }}>
                <AppText title="Date" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => openPicker('date')}
                  style={styles.touchableField}
                >
                  <AppTextInput
                    value={rideDate ? formatDate(rideDate) : ''}
                    inputPlaceHolder="Select Date"
                    containerBg={styles.inputBg.backgroundColor}
                    borderColor="transparent"
                    borderWidth={1}
                    inputWidth={42}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, gap: responsiveWidth(1), }}>
                <AppText title="Time" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => openPicker('time')}
                  style={styles.touchableField}
                >
                  <AppTextInput
                    value={rideTime ? formatTime(rideTime) : ''}
                    inputPlaceHolder="Select Time"
                    containerBg={styles.inputBg.backgroundColor}
                    borderColor="transparent"
                    borderWidth={1}
                    inputWidth={42}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <SectionHeading label="Available Seats" iconColor="#0D7CF4" icon={AppIcons.users} />
            <AppText title="Seats" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
            <AppTextInput
              value={seats}
              onChangeText={setSeats}
              inputPlaceHolder="Enter seats"
              containerBg={styles.inputBg.backgroundColor}
              borderColor="transparent"
              borderWidth={1}
              inputWidth={28}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.formGroup}>
            <SectionHeading label="Car Information" iconColor="#0D7CF4" icon={AppIcons.car} />
            <View style={styles.inlineRow}>
              <View style={{ flex: 1, gap: responsiveWidth(1), }}>
                <AppText title="Make" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={make}
                  onChangeText={setMake}
                  inputPlaceHolder="Enter make"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                />
              </View>
              <View style={{ flex: 1, gap: responsiveWidth(1), }}>
                <AppText title="Model" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={model}
                  onChangeText={setModel}
                  inputPlaceHolder="Enter model"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                />
              </View>
            </View>
            <View style={styles.inlineRow}>
              <View style={{ flex: 1, gap: responsiveWidth(1), }}>
                <AppText title="Color" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={color}
                  onChangeText={setColor}
                  inputPlaceHolder="Enter color"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                />
              </View>
              <View style={{ flex: 1, gap: responsiveWidth(1), }}>
                <AppText title="License Plate" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={plate}
                  onChangeText={setPlate}
                  inputPlaceHolder="Enter license plate"
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
            textSize={2}
            loading={false}
            loaderSize="small"
          />
        </BoxShadow>
      </AppKeyboardAvoidingView>
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
                minimumDate={iosPickerState.mode === 'date' ? new Date() : undefined}
                display="spinner"
                onChange={handleIosChange}
                style={{ backgroundColor: AppColors.WHITE }}
                textColor={AppColors.BLACK}
              />
            </View>
          </View>
        </Modal>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(4),
    gap: responsiveHeight(2),
  },
  keyboardScrollContent: {
    paddingVertical: responsiveHeight(2),
    paddingBottom: responsiveHeight(4),
  },
  formGroup: {
    gap: responsiveWidth(1),
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
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(8),
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
    <View
    // style={styles.headingIcon}
    >
      {icon ? (
        <SVGXml icon={icon} width={responsiveWidth(6)} height={responsiveWidth(6)} />
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
    <AppText title={label} textColor={iconColor} textFontWeight textSize={1.9} />
  </View>
);

export default OfferRide;
