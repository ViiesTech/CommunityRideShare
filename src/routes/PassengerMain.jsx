import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/PassengerMain/Home/Home';
import OfferRide from '../screens/PassengerMain/Home/OfferRide';
import FindRides from '../screens/PassengerMain/Search/FindRides';
import RiderDetail from '../screens/PassengerMain/Search/RiderDetail';
import SVGXml from '../components/SVGXML';
import { AppIcons } from '../assets/icons';
import AppColors from '../utils/AppColors';
import AppText from '../components/AppText';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const tabIconMap = {
	Home: AppIcons.homeTab,
	Search: AppIcons.search,
	Calendar: AppIcons.calendar,
	Profile: AppIcons.profileTab,
};

const PlaceholderScreen = ({ title }) => (
	<View style={styles.placeholder}>
		<AppText title={`${title} screen`} textColor={AppColors.DARKGRAY} textSize={1.8} />
	</View>
);

const CalendarScreen = () => <PlaceholderScreen title="Calendar" />;
const ProfileScreen = () => <PlaceholderScreen title="Profile" />;

const tabScreenOptions = ({ route }) => ({
	headerShown: false,
	tabBarShowLabel: false,
	tabBarStyle: styles.tabBar,
	tabBarItemStyle: styles.tabItem,
	tabBarIcon: ({ focused }) => (
		<TabIcon icon={tabIconMap[route.name]} focused={focused} />
	),
});

const PassengerMain = () => (
	<HomeStack.Navigator screenOptions={{ headerShown: false }}>
		<HomeStack.Screen name="HomeMain" component={HomeStackScreen} />
		<HomeStack.Screen name="OfferRide" component={OfferRide} />
		<HomeStack.Screen name="RiderDetail" component={RiderDetail} />
	</HomeStack.Navigator>
);

const HomeStackScreen = () => {
	return (
		<Tab.Navigator screenOptions={tabScreenOptions}>
			<Tab.Screen name="Home" component={Home} />
			<Tab.Screen name="Search" component={FindRides} />
			<Tab.Screen name="Calendar" component={CalendarScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
	tabBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 68,
		borderRadius: 0,
		backgroundColor: AppColors.WHITE,
		elevation: 20,
		shadowColor: '#00133D',
		shadowOpacity: 0.18,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 12 },
		borderTopWidth: 0,
		paddingHorizontal: 12,
	},
	tabItem: {
		paddingVertical: 12,
	},
	iconStack: {
		alignItems: 'center',
		justifyContent: 'center',
		gap: 4,
	},
	iconShell: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconShellActive: {
		backgroundColor: 'transparent',
	},
	activeDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#0D7CF4',
	},
	placeholder: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: AppColors.WHITE,
	},
	iconActive: {
		opacity: 1,
	},
	iconInactive: {
		opacity: 0.45,
	},
});

const TabIcon = ({ icon, focused }) => (
	<View style={styles.iconStack}>
		<View style={[styles.iconShell, focused && styles.iconShellActive]}>
			<SVGXml
				icon={icon}
				width={20}
				height={20}
				style={focused ? styles.iconActive : styles.iconInactive}
			/>
		</View>
		{focused && <View style={styles.activeDot} />}
	</View>
);

export default PassengerMain;
