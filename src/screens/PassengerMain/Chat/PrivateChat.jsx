import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';

const messages = [
  {
    id: 'm1',
    author: 'me',
    text: "Hello! I'm available to pick you up. I'll be there in about",
    time: '02.00 PM',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 'm2',
    author: 'other',
    text: 'Thank you Sir',
    time: '02.00 PM',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'm3',
    author: 'me',
    text: "I've arrived at Location. Look for a Red Car with the license plate XXXX.",
    time: '02.00 PM',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 'm4',
    author: 'other',
    text: "Great! I'll be there in a minute.",
    time: '02.00 PM',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'm5',
    author: 'me',
    typing: true,
    time: '02.00 PM',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
];

const PrivateChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const participant = route.params?.participant;
  const participantName = participant?.name ?? 'Leilani Angel';
  const participantAvatar = participant?.avatar ?? 'https://i.pravatar.cc/150?img=47';

  const renderMessage = ({ item }) => {
    const isMe = item.author === 'me';
    const bubbleColor = isMe ? '#CFE4FF' : '#D8F4E0';
    const textColor = isMe ? AppColors.BLACK : AppColors.DARKGRAY;
    const avatarUri = isMe ? item.avatar : participantAvatar;

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={[styles.bubbleWrapper, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
          <View style={[styles.bubble, isMe ? styles.bubbleMine : styles.bubbleOther, { backgroundColor: bubbleColor }]}> 
            {item.typing ? (
              <View style={styles.typingDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            ) : (
              <AppText title={item.text} textColor={textColor} textSize={1.4} />
            )}
          </View>
          <AppText
            title={item.time}
            textColor={AppColors.GRAY}
            textSize={1.1}
            textAlignment={isMe ? 'right' : 'left'}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <SVGXml icon={AppIcons.arrowLeft} width={20} height={20} />
          </TouchableOpacity>
          <AppText title={participantName} textColor={AppColors.BLACK} textFontWeight textSize={2.1} />
          <TouchableOpacity style={styles.callButton}>
            <SVGXml icon={AppIcons.phoneSolid} width={18} height={18} />
          </TouchableOpacity>
        </View>
        <View style={styles.dayPill}>
          <AppText title="Today" textColor={AppColors.GRAY} textFontWeight textSize={1.2} />
        </View>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          ListFooterComponent={<View style={{ height: responsiveHeight(2) }} />}
        />
        <View style={styles.composerRow}>
          <TextInput
            placeholder="Type Your Message"
            placeholderTextColor="#A5AEC2"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton}>
            <AppText title="😊" textSize={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2.5),
  },
  list: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
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
  callButton: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: '#39C46A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  dayPill: {
    alignSelf: 'center',
    marginVertical: responsiveHeight(2),
    backgroundColor: '#EEF2FB',
    borderRadius: 18,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.4),
  },
  messagesList: {
    gap: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: responsiveWidth(2.5),
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
  },
  messageRowOther: {
    flexDirection: 'row',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bubbleWrapper: {
    maxWidth: '70%',
    gap: responsiveHeight(0.6),
  },
  bubbleLeft: {
    alignItems: 'flex-start',
  },
  bubbleRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.4),
    borderRadius: 18,
  },
  bubbleMine: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
  },
  typingDots: {
    flexDirection: 'row',
    gap: responsiveWidth(1.5),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3A7BF7',
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.WHITE,
    borderRadius: 28,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.6),
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    flex: 1,
    fontSize: responsiveHeight(1.5),
    color: AppColors.BLACK,
  },
  sendButton: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PrivateChat;
