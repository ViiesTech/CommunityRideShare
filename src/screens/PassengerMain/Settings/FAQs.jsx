import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
import { TouchableOpacity } from 'react-native-gesture-handler';

const defaultAnswer =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const faqs = [
  { id: 'faq1', question: 'Lorem ipsum dollor ?', answer: defaultAnswer },
  { id: 'faq2', question: 'Lorem ipsum dollor ?', answer: defaultAnswer },
  { id: 'faq3', question: 'Lorem ipsum dollor ?', answer: defaultAnswer },
  { id: 'faq4', question: 'Lorem ipsum dollor ?', answer: defaultAnswer },
  { id: 'faq5', question: 'Lorem ipsum dollor ?', answer: defaultAnswer },
];

const FAQs = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = React.useState(null);

  const handleToggle = React.useCallback(id => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()}>
            <SVGXml icon={AppIcons.arrowLeft} width={18} height={18} />
          </TouchableOpacity>
          <AppText title="FAQs" textColor={AppColors.BLACK} textFontWeight textSize={2.2} />
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.listWrap}>
          {faqs.map(({ id, question, answer }, index) => {
            const isExpanded = expandedId === id;
            const showDivider = isExpanded && answer;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.card, index === 0 && styles.firstCard]}
                activeOpacity={0.85}
                onPress={() => handleToggle(id)}
              >
                <View style={styles.cardHeader}>
                  <AppText title={question} textColor={AppColors.BLACK} textFontWeight textSize={1.7} />
                  <SVGXml icon={AppIcons.arrowDownBlue} width={14} height={14} />
                </View>
                {isExpanded && answer ? (
                  <>
                    {showDivider && <View style={styles.answerDivider} />}
                    <AppText
                      title={answer}
                      textColor={AppColors.DARKGRAY}
                      textSize={1.55}
                      lineHeight={2.2}
                    />
                  </>
                ) : null}
              </TouchableOpacity>
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
  listWrap: {
    marginTop: responsiveHeight(1),
    gap: responsiveHeight(1.4),
  },
  card: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4E7EE',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.6),
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  firstCard: {
    shadowOpacity: 0.08,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: responsiveWidth(2),
  },
  answerDivider: {
    marginVertical: responsiveHeight(1.2),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E8ED',
  },
});

export default FAQs;
