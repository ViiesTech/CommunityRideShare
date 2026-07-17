import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectCommunityRole, setCommunityId } from '../redux/slices/authSlice';
import Auth from './Auth';
import PassengerMain from './PassengerMain';
import JoinCommunity from '../screens/Auth/JoinCommunity';
import { useGetMeQuery } from '../redux/api/apiSlice';
import { setUser, setCommunityRole } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const Stack = createStackNavigator();

const Routes = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const communityRole = useSelector(selectCommunityRole);

  const { data: me, isFetching } = useGetMeQuery(undefined, {
    skip: !authToken,
    refetchOnMountOrArgChange: true,
  });

  React.useEffect(() => {
    if (me) {
      dispatch(setUser(me));

      // agar role / community backend se aa rahi ho
      if (me.communityRole) {
        dispatch(setCommunityRole(me.communityRole));
        dispatch(setCommunityId(me.communityId));
      }
    }
  }, [me]);

  // if (authToken && isFetching) {
  //   return null; // Splash / Loader
  // }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!authToken ? (
        <Stack.Screen name="Auth" component={Auth} />
      ) : !communityRole ? (
        <Stack.Screen name="JoinCommunity" component={JoinCommunity} />
      ) : (
        <Stack.Screen name="Main" component={PassengerMain} />
      )}
    </Stack.Navigator>
  );
};

export default Routes;
