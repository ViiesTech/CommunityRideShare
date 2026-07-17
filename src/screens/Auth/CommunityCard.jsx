import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppText from '../../components/AppText';
import AppColors from '../../utils/AppColors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../utils/Responsive_Dimensions';

const CommunityCard = ({ name, members, isRequest, onRequest, onCancelRequest, isLoading, isCancelling }) => {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <AppText title={name} textColor={AppColors.BLACK} textFontWeight textSize={2} />
        <AppText title={`${members} members`} textColor={AppColors.DARKGRAY} textSize={1.4} />
      </View>
      {isRequest ? (
        <TouchableOpacity
          style={styles.requestedBtn}
          activeOpacity={0.85}
          onPress={onCancelRequest}
          disabled={isCancelling}
        >
          {isCancelling && (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={responsiveFontSize(1.9)} color={AppColors.WHITE} />
            </View>
          )}
          <AppText
            title="Cancel request"
            textColor={isCancelling ? 'rgba(255,255,255,0)' : AppColors.WHITE}
            textSize={1.4}
            textFontWeight
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.requestBtn}
          activeOpacity={0.85}
          onPress={onRequest}
          disabled={isLoading}
        >
          {isLoading && (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={responsiveFontSize(1.9)} color={AppColors.WHITE} />
            </View>
          )}
          <AppText
            title="Request"
            textColor={isLoading ? 'rgba(255,255,255,0)' : AppColors.WHITE}
            textSize={1.4}
            textFontWeight
          />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestedBtn: {
    backgroundColor: AppColors.ThemeColor,
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommunityCard;
