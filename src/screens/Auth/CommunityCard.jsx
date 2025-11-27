import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../../components/AppText';
import AppColors from '../../utils/AppColors';
import { responsiveHeight, responsiveWidth } from '../../utils/Responsive_Dimensions';

const CommunityCard = ({ name, members, status }) => {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <AppText title={name} textColor={AppColors.BLACK} textFontWeight textSize={2} />
        <AppText title={`${members} members`} textColor={AppColors.DARKGRAY} textSize={1.4} />
      </View>
      {status === 'requested' ? (
        <View style={styles.requestedBtn}>
          <AppText title="Requested" textColor={AppColors.WHITE} textSize={1.4} textFontWeight />
        </View>
      ) : (
        <TouchableOpacity style={styles.requestBtn} activeOpacity={0.85}>
          <AppText title="Request" textColor={AppColors.WHITE} textSize={1.4} textFontWeight />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3E6EF',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    gap: responsiveWidth(4),
    marginBottom: 0,
  },
  requestBtn: {
    backgroundColor: AppColors.darkBlue,
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
  },
  requestedBtn: {
    backgroundColor: AppColors.ThemeColor,
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
  },
});

export default CommunityCard;
