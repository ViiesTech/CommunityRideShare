/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import AppColors from '../../utils/AppColors';
import AuthHeader from '../../components/AuthHeader';
import { AppIcons } from '../../assets/icons';
import LineBreak from '../../components/LineBreak';
import SVGXml from '../../components/SVGXML';
import AppText from '../../components/AppText';
import { responsiveWidth } from '../../utils/Responsive_Dimensions';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';

const data = [
  { id: 1, icon: AppIcons.user, title: 'Passenger' },
  { id: 2, icon: AppIcons.landscaper, title: 'Admin' },
];

const SelectType = () => {
  const nav = useNavigation();
  const [type, setType] = useState('Passenger');

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.WHITE }}>
      <LineBreak space={4} />
      <AuthHeader pageHead="Getting Started With..." />
      <LineBreak space={4} />

      <View style={{ alignItems: 'center' }}>
        <FlatList
          data={data}
          ItemSeparatorComponent={<LineBreak space={1} />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setType(item.title)}>
              {/* <SVGXml
                icon={item.icon}
                width={responsiveWidth(32)}
                height={responsiveWidth(32)}
              /> */}
              <LineBreak space={2} />
              <AppText
                title={item.title}
                textSize={2}
                textColor={
                  type === item.title ? AppColors.ThemeColor : AppColors.GRAY
                }
                textFontWeight
                textAlignment={'center'}
              />
            </TouchableOpacity>
          )}
        />

        <LineBreak space={2} />

        <AppButton
          title={'Continue'}
          bgColor={AppColors.BLACK}
          handlePress={() => nav.navigate('SignUp')}
        />
      </View>
    </View>
  );
};

export default SelectType;
