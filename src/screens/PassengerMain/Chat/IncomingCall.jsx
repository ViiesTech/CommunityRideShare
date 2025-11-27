import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';

const IncomingCall = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const participant = route.params ? route.params.participant : null;
  const participantName = participant?.name ?? 'Leilani Angel';
  const participantAvatar = participant?.avatar ?? 'https://i.pravatar.cc/150?img=32';
  const statusText = 'Your Rider Calling...';
  const ringSizes = [98, 82, 68, 52];
  const leftDotSizes = [12, 10, 7];
  const rightDotSizes = [7, 10, 12];
  const largestLeftDot = Math.max(...leftDotSizes);
  const largestRightDot = Math.max(...rightDotSizes);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppText
          title="Incoming Call"
          textColor={AppColors.WHITE}
          textFontWeight
          textSize={3.2}
          textAlignment="center"
          style={styles.title}
        />

        <View style={styles.ringsWrapper}>
          {ringSizes.map((size, index) => (
            <View
              key={size}
              style={[
                styles.ring,
                {
                  width: responsiveWidth(size),
                  height: responsiveWidth(size),
                  borderRadius: responsiveWidth(size) / 2,
                  opacity: 0.15 + index * 0.08,
                },
              ]}
            />
          ))}
          <View style={styles.avatarShell}>
            <Image source={{ uri: participantAvatar }} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.infoBlock}>
          <AppText
            title={participantName}
            textColor={AppColors.WHITE}
            textFontWeight
            textSize={3.4}
            textAlignment="center"
          />
          <AppText
            title={statusText}
            textColor="rgba(255,255,255,0.7)"
            textSize={2}
            textAlignment="center"
          />
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.circleButton, styles.declineCircle]}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome6
              name="phone-slash"
              size={responsiveFontSize(2.5)}
              color="#EB5757"
            />
          </TouchableOpacity>

          <View style={styles.dotTrack}>
            {[...leftDotSizes].reverse().map((size, idx) => {
              const dotColor = size === largestLeftDot ? AppColors.WHITE : 'rgba(255,255,255,0.6)';
              return (
                <View
                  key={`dot-left-${idx}`}
                  style={[styles.trackDot, { width: size, height: size, borderRadius: size / 2, backgroundColor: dotColor }]}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.circleButtonLarge, styles.mainCircle]}
            onPress={() => navigation.navigate('PrivateChat', { participant })}
          >
            <FontAwesome6
              name="phone"
              size={responsiveFontSize(4)}
              color={AppColors.ThemeBlue}
            />
          </TouchableOpacity>

          <View style={styles.dotTrack}>
            {[...rightDotSizes].reverse().map((size, idx) => {
              const dotColor = size === largestRightDot ? AppColors.WHITE : 'rgba(255,255,255,0.6)';
              return (
                <View
                  key={`dot-right-${idx}`}
                  style={[styles.trackDot, { width: size, height: size, borderRadius: size / 2, backgroundColor: dotColor }]}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.circleButton, styles.acceptCircle]}
            onPress={() => navigation.navigate('PrivateChat', { participant })}
          >
            <Feather
              name="phone-call"
              size={responsiveFontSize(2.5)}
              color={AppColors.BGCOLOURS}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0887FC',
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(3),
  },
  title: {
    width: '100%',
  },
  ringsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: '#FFFFFF',
  },
  avatarShell: {
    width: responsiveWidth(38),
    height: responsiveWidth(38),
    borderRadius: responsiveWidth(19),
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoBlock: {
    alignItems: 'center',
    gap: responsiveHeight(0.6),
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveWidth(3),
    alignSelf: 'center',
  },
  circleButton: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonLarge: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.WHITE,
  },
  declineCircle: {
    backgroundColor: '#84C3FE',
  },
  acceptCircle: {
    backgroundColor: '#84C3FE',
  },
  mainCircle: {
    shadowColor: '#083C75',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  dotTrack: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  trackDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});

export default IncomingCall;
