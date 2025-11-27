import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppText';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const contentMap = {
  terms: {
    title: 'Terms of Use',
    body:
      'Duis aute irure dolor in reprehenderit in voluptate vel esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nDuis aute irure dolor in reprehenderit in voluptate esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nDuis aute irure dolor in reprehenderit in voluptate esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
  },
  privacy: {
    title: 'Privacy Policy',
    body:
      'We value your privacy. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nBy using Community Ride Share you consent to the data practices described in this statement. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  help: {
    title: 'Help',
    body: `Need assistance with your account or trips? Review the guidance below. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

If you still need help, reach out to our support team or refer to the FAQs for common answers. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
  },
};

const DocumentInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const type = route.params?.type ?? 'terms';
  const content = contentMap[type] ?? contentMap.terms;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()}>
            <SVGXml icon={AppIcons.arrowLeft} width={18} height={18} />
          </TouchableOpacity>
          <AppText title={content.title} textColor={AppColors.BLACK} textFontWeight textSize={2.2} />
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.bodyCard}>
          <AppText
            title={content.body}
            textColor={AppColors.DARKGRAY}
            lineHeight={2.4}
            textSize={1.55}
          />
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
    paddingVertical: responsiveHeight(3),
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
  bodyCard: {
    backgroundColor: '#EFEFF3',
    borderRadius: 18,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2.4),
    borderWidth: 1,
    borderColor: '#E4E7EE',
  },
});

export default DocumentInfo;
