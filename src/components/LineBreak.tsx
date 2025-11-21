/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {responsiveHeight} from '../utils/Responsive_Dimensions';

type props = {
  space?: any;
};

const LineBreak = ({space}: props) => {
  return (
    <View
      style={{
        height: responsiveHeight(space),
        opacity: 0,
        overflow: 'visible',
        zIndex: 0,
      }}
    />
  );
};

export default LineBreak;
