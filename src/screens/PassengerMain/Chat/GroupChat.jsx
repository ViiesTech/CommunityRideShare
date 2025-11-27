import React from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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

const defaultGroupInfo = {
  title: 'Sunset Garden Community',
  email: 'leilaniangel@gmail.com',
  phone: '+12 345 6789',
  rating: '5.0',
  seats: '3/4 Seats Available',
  timeLabel: 'Time & Date',
  date: 'Mon, Jan 15, 9:30 AM',
  departingText: 'Departing Soon',
  carSeat: 'Car Seat',
  routeStart: 'Mall Central',
  routeEnd: 'University Campus',
  thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
};

const memberAvatars = [
  'https://i.pravatar.cc/150?img=32',
  'https://i.pravatar.cc/150?img=47',
  'https://i.pravatar.cc/150?img=12',
];

const groupMessages = [
  {
    id: 'gm-1',
    author: 'me',
    text: 'Hi! Are you on the way?',
    time: '11:20 PM',
    status: '✓✓',
  },
  {
    id: 'gm-2',
    author: 'other',
    text: "Yes, I just accepted your booking. I'll reach in 5 minutes.",
    time: '11:20 PM',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 'gm-3',
    author: 'me',
    text: "Okay, I'm waiting outside near the main gate. 😇",
    time: '11:20 PM',
    status: '✓✓',
  },
  {
    id: 'gm-4',
    author: 'me',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
    time: '11:20 PM',
    status: '✓✓',
  },
  {
    id: 'gm-5',
    author: 'other',
    text: "Got it, I'll stop right in front of the gate. Please share landmark if possible.",
    time: '11:20 PM',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 'gm-6',
    author: 'other',
    typing: true,
    time: '11:21 PM',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
];

const GroupChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const conversation = route.params?.conversation;
  const groupInfo = {
    ...defaultGroupInfo,
    title: conversation?.name || defaultGroupInfo.title,
  };

  const renderHeader = () => (
    <View style={styles.infoWrapper}>
      <View style={styles.groupCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.thumbnailColumn}>
            <Image source={{ uri: groupInfo.thumbnail }} style={styles.groupThumbnail} />
            <View style={styles.ratingChip}>
              <SVGXml icon={AppIcons.starFilled} width={14} height={14} />
              <AppText title={groupInfo.rating} textColor={AppColors.WHITE} textFontWeight textSize={1.15} />
            </View>
          </View>
          <View style={styles.cardTitleBlock}>
            <AppText
              title={defaultGroupInfo.title}
              textColor={AppColors.WHITE}
              textFontWeight
              textSize={1.9}
            />
            <AppText title={groupInfo.email} textColor="#DCEBFF" textSize={1.25} />
            <AppText title={`Phone : ${groupInfo.phone}`} textColor="#DCEBFF" textSize={1.25} />
          </View>
        </View>
        <View style={styles.joinedBadge}>
          <AppText title="joined" textColor={AppColors.WHITE} textSize={1.05} textFontWeight />
        </View>
        <View style={styles.groupBottom}>
          <View style={styles.cardMetaGroup}>
            <View style={styles.cardMetaRow}>
              <AppText title={groupInfo.carSeat} textColor="#7A8AA8" textSize={1.15} />
              <AppText title={groupInfo.seats} textColor={AppColors.BLACK} textFontWeight textSize={1.25} />
            </View>
            <View style={styles.cardMetaRow}>
              <AppText title={groupInfo.timeLabel} textColor="#7A8AA8" textSize={1.15} />
              <View style={styles.timeValueRow}>
                <AppText title={groupInfo.date} textColor={AppColors.BLACK} textFontWeight textSize={1.2} />
                <AppText
                  title={groupInfo.departingText}
                  textColor={AppColors.ThemeBlue}
                  textSize={1.1}
                  style={styles.departSoon}
                />
              </View>
            </View>
          </View>
          <View style={styles.bottomDivider} />
          <View style={styles.routeInfoRow}>
            <SVGXml icon={AppIcons.locationGreen} width={20} height={20} />
            <AppText
              title={`${groupInfo.routeStart}  →  ${groupInfo.routeEnd}`}
              textColor={AppColors.BLACK}
              textFontWeight
              textSize={1.3}
            />
          </View>
        </View>
      </View>

      <View style={styles.membersCard}>
        <View style={styles.membersLeft}>
          <View style={styles.avatarStack}>
            {memberAvatars.map((uri, index) => (
              <Image
                key={uri}
                source={{ uri }}
                style={[styles.memberAvatar, index !== 0 && styles.memberAvatarOverlap]}
              />
            ))}
          </View>
          <View>
            <View style={styles.memberLabelRow}>
              <AppText title={`${memberAvatars.length} Members`} textColor={AppColors.BLACK} textFontWeight textSize={1.45} />
            </View>
            <AppText title="Online" textColor="#11B57C" textSize={1.2} />
          </View>
        </View>
        <View style={styles.memberStatus}>
          <SVGXml icon={AppIcons.users} width={20} height={20} />
          <AppText title="Group" textColor={AppColors.ThemeBlue} textSize={1.1} />
        </View>
      </View>

      <AppText
        title="Conversation"
        textColor={AppColors.DARKGRAY}
        textFontWeight
        textSize={1.35}
        style={styles.sectionTitle}
      />
    </View>
  );

  const renderMessage = ({ item }) => {
    const isMe = item.author === 'me';
    const bubbleColor = isMe ? '#E7F2FF' : '#0D7CF4';
    const textColor = isMe ? AppColors.BLACK : AppColors.WHITE;
    const alignmentStyle = isMe ? styles.messageRowMe : styles.messageRowOther;

    return (
      <View style={[styles.messageRow, alignmentStyle]}>
        {!isMe && (
          <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
        )}
        <View style={[styles.bubbleWrapper, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
          <View style={[styles.messageBubble, { backgroundColor: bubbleColor }]}
          >
            {item.typing ? (
              <View style={styles.typingDots}>
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotDelay]} />
                <View style={[styles.dot, styles.dotDelayLong]} />
              </View>
            ) : item.type === 'image' ? (
              <Image source={{ uri: item.image }} style={styles.messageImage} />
            ) : (
              <AppText title={item.text} textColor={textColor} textSize={1.35} />
            )}
          </View>
          <View style={styles.messageMetaRow}>
            <AppText
              title={item.time}
              textColor={AppColors.GRAY}
              textSize={1.1}
              textAlignment={isMe ? 'right' : 'left'}
            />
            {item.status ? (
              <AppText
                title={item.status}
                textColor={AppColors.ThemeBlue}
                textSize={1.05}
                style={styles.messageStatus}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
              <SVGXml icon={AppIcons.arrowLeft} width={20} height={20} />
            </TouchableOpacity>
            <AppText
              title={groupInfo.title}
              textColor={AppColors.BLACK}
              textFontWeight
              textSize={2.2}
            />
            <View style={styles.headerPlaceholder} />
          </View>

          <FlatList
            data={groupMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={<View style={{ height: responsiveHeight(2) }} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.composerRow}>
            <TextInput
              placeholder="Type a message"
              placeholderTextColor="#9BA3B4"
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton}>
              <SVGXml icon={AppIcons.send} width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4.5),
    paddingTop: responsiveHeight(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  headerButton: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(5.5),
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  headerPlaceholder: {
    width: responsiveWidth(11),
  },
  infoWrapper: {
    gap: responsiveHeight(2),
  },
  groupCard: {
    backgroundColor: '#0D7CF4',
    borderRadius: 20,
    padding: responsiveWidth(4),
    paddingBottom: 0,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    position: 'relative',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  thumbnailColumn: {
    alignItems: 'center',
    gap: responsiveHeight(0.8),
  },
  groupThumbnail: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    borderRadius: responsiveWidth(8),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  cardTitleBlock: {
    flex: 1,
    gap: responsiveHeight(0.45),
    marginTop: -responsiveHeight(0.5),
  },
  joinedBadge: {
    position: 'absolute',
    top: responsiveHeight(1.2),
    right: responsiveWidth(4),
    backgroundColor: '#0B0B0B',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.45),
    borderRadius: 12,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(1.8),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  groupBottom: {
    backgroundColor: AppColors.WHITE,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: -responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.4),
    marginTop: responsiveHeight(1),
    gap: responsiveHeight(1.2),
  },
  bottomDivider: {
    height: 1,
    backgroundColor: '#E6ECF5',
  },
  cardMetaGroup: {
    gap: responsiveHeight(0.9),
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  departSoon: {
    paddingHorizontal: responsiveWidth(2),
  },
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2.5),
  },
  membersCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 16,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  membersLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  avatarStack: {
    flexDirection: 'row',
  },
  memberAvatar: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(5.5),
    borderWidth: 2,
    borderColor: AppColors.WHITE,
  },
  memberAvatarOverlap: {
    marginLeft: -responsiveWidth(3),
  },
  memberLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  memberStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(0.3),
  },
  sectionTitle: {
    marginTop: responsiveHeight(0.5),
  },
  listContent: {
    paddingBottom: responsiveHeight(4),
    gap: responsiveHeight(1.8),
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2.5),
  },
  },
  bubbleLeft: {
    alignItems: 'flex-start',
  },
  bubbleRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.4),
    borderRadius: 18,
  },
  messageImage: {
    width: responsiveWidth(50),
    height: responsiveHeight(18),
    borderRadius: 14,
  },
  messageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1.5),
  },
  messageStatus: {
    marginTop: -responsiveHeight(0.1),
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.WHITE,
    opacity: 0.85,
  },
  dotDelay: {
    opacity: 0.65,
  },
  dotDelayLong: {
    opacity: 0.45,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.WHITE,
    borderRadius: 30,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.6),
    marginBottom: responsiveHeight(1.5),
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    flex: 1,
    fontSize: responsiveHeight(1.6),
    color: AppColors.BLACK,
  },
  sendButton: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    backgroundColor: AppColors.ThemeBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GroupChat;
