import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';

const tabs = [
  { key: 'messages', label: 'Messages' },
  { key: 'call-history', label: 'Call History' },
  { key: 'group-chat', label: 'Group Chat' },
];

const chatThreads = [
  {
    id: '1',
    name: 'Leilani Angel',
    tagline: '(your rider now)',
    status: '1 New Message',
    snippet: "Hello! I'm available to pick you up. I'll be there shortly.",
    time: '2m ago',
    avatar: 'https://i.pravatar.cc/150?img=32',
    isActive: true,
  },
  {
    id: '2',
    name: 'Alex Wheeler',
    status: 'No New Message',
    snippet: "Hello! I'm available to pick you up. I'll be there shortly.",
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '3',
    name: 'Jasmine Cruz',
    status: '2 New Message',
    snippet: 'Hello sir, good day. Im on your front house..',
    time: '09/25/24',
    avatar: 'https://i.pravatar.cc/150?img=48',
  },
  {
    id: '4',
    name: 'Olivia Parker',
    status: 'No New Message',
    snippet: "Hello! I'm available to pick you up. I'll be there shortly.",
    time: '09/24/24',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: '5',
    name: 'Marcus Anderson',
    status: '2 New Message',
    snippet: "Hello! I'm available to pick you up. I'll be there shortly.",
    time: '09/23/24',
    avatar: 'https://i.pravatar.cc/150?img=50',
  },
  {
    id: '6',
    name: 'Raj Patel',
    status: 'No New Message',
    snippet: "Hello! I'm available to pick you up. I'll be there shortly.",
    time: '09/22/24',
    avatar: 'https://i.pravatar.cc/150?img=53',
  },
  {
    id: '7',
    name: 'Emily Turner',
    status: '2 New Message',
    snippet: "Hello! I'm available to pick you up. I'll be there shortly.",
    time: '09/19/24',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: '8',
    name: 'Javier Ramirez',
    status: '2 New Message',
    snippet: "Hello! I'm available to pick you up. I'll be there shortly.",
    time: '09/19/24',
    avatar: 'https://i.pravatar.cc/150?img=64',
  },
];

const groupChatThreads = chatThreads.map(thread => ({
  ...thread,
  id: `group-${thread.id}`,
  name: 'Group Chat',
}));

const callHistoryLogs = [
  {
    id: 'call-1',
    name: 'Leilani Angel',
    statusText: 'Accept - 12 second',
    time: '2m ago',
    avatar: 'https://i.pravatar.cc/150?img=32',
    isActive: true,
    tagline: '(your rider now)',
  },
  {
    id: 'call-2',
    name: 'Alex Wheeler',
    statusText: 'Decline',
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'call-3',
    name: 'Jasmine Cruz',
    statusText: 'Accept - 12 second',
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=48',
  },
  {
    id: 'call-4',
    name: 'Olivia Parker',
    statusText: 'Accept - 12 second',
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'call-5',
    name: 'Raj Patel',
    statusText: 'Accept - 12 second',
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=53',
  },
  {
    id: 'call-6',
    name: 'Marcus Anderson',
    statusText: 'Decline',
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=50',
  },
  {
    id: 'call-7',
    name: 'Emily Turner',
    statusText: 'Accept - 12 second',
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 'call-8',
    name: 'Javier Ramirez',
    statusText: 'Decline',
    time: '09/27/24',
    avatar: 'https://i.pravatar.cc/150?img=64',
  },
];

const Chat = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('messages');

  const visibleThreads = useMemo(() => {
    switch (activeTab) {
      case 'messages':
        return chatThreads;
      case 'call-history':
        return callHistoryLogs;
      case 'group-chat':
        return groupChatThreads;
      default:
        return [];
    }
  }, [activeTab]);

  const renderThread = ({ item }) => {
    const isMessagesTab = activeTab === 'messages';
    const isGroupTab = activeTab === 'group-chat';
    const isCallHistoryTab = activeTab === 'call-history';
    const isChatThreadTab = isMessagesTab || isGroupTab;
    const nameColor = AppColors.BLACK;
    const secondaryColor = '#7D8597';
    const showTagline = !!item.tagline;
    const statusText = isChatThreadTab ? item.status : item.statusText;
    const snippetText = isChatThreadTab ? item.snippet : null;
    const handlePress = () => {
      if (isMessagesTab) {
        navigation.navigate('PrivateChat', { participant: item });
        return;
      }
      if (isGroupTab) {
        navigation.navigate('GroupChat', { conversation: item });
        return;
      }
      if (isCallHistoryTab) {
        navigation.navigate('IncomingCall', { participant: item });
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.threadCard}
        onPress={handlePress}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.threadContent}>
          <View
            style={[styles.threadBody, isChatThreadTab ? styles.threadBodyMessages : styles.threadBodyCall]}
          >
            <View style={styles.nameBlock}>
              <AppText
                title={item.name}
                textColor={nameColor}
                textFontWeight
                textSize={1.75}
              />
              {showTagline ? (
                <AppText
                  title={` ${item.tagline}`}
                  textColor={secondaryColor}
                  textSize={1.3}
                />
              ) : null}
            </View>
            <AppText
              title={statusText}
              textColor={isChatThreadTab ? nameColor : '#9BA3B4'}
              textFontWeight
              textSize={1.45}
              style={isCallHistoryTab && styles.statusCompact}
            />
            {snippetText ? (
              <AppText
                title={snippetText}
                textColor={secondaryColor}
                textSize={1.35}
                numberOfLines={1}
              />
            ) : null}
          </View>
          <View style={styles.timeContainer}>
            <AppText
              title={item.time}
              textColor={AppColors.BLACK}
              textSize={1.35}
              textAlignment="center"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <SVGXml icon={AppIcons.arrowLeft} width={20} height={20} />
          </TouchableOpacity>
          <AppText
            title="Chat"
            textColor={AppColors.BLACK}
            textFontWeight
            textSize={2.4}
          />
          <View style={{ width: responsiveWidth(10) }} />
        </View>

        <View style={styles.tabRow}>
          {tabs.map(tab => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <AppText
                  title={tab.label}
                  textColor={isActive ? AppColors.WHITE : AppColors.GRAY}
                  textFontWeight={isActive}
                  textSize={1.35}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={visibleThreads}
          keyExtractor={item => item.id}
          renderItem={renderThread}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  container: {
    flex: 1,
    paddingTop: responsiveHeight(2.5),
  },
  list: {
    backgroundColor: AppColors.WHITE,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
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
  tabRow: {
    flexDirection: 'row',
    gap: responsiveWidth(3),
    marginBottom: responsiveHeight(2.4),
    justifyContent: 'center',
  },
  tabChip: {
    flexGrow: 0,
    paddingHorizontal: responsiveWidth(4.5),
    minWidth: responsiveWidth(22),
    borderRadius: 26,
    backgroundColor: '#E8ECF5',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.2),
  },
  tabChipActive: {
    backgroundColor: '#0D7CF4',
    shadowColor: '#0F172A',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  listContent: {
    paddingBottom: responsiveHeight(10),
  },
  threadCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.WHITE,
    paddingVertical: responsiveHeight(1.6),
    paddingHorizontal: responsiveWidth(5),
    gap: responsiveWidth(3),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E8F3',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  threadContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  threadBody: {
    flex: 1,
  },
  threadBodyMessages: {
    gap: responsiveHeight(0.1),
  },
  threadBodyCall: {
    gap: 0,
  },
  statusCompact: {
    marginTop: -responsiveHeight(0.55),
  },
  nameBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginRight: responsiveWidth(2),
  },
  timeContainer: {
    minWidth: responsiveWidth(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Chat;
