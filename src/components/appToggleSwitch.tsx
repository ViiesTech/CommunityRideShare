import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import AppColors from '../utils/AppColors';
import { responsiveWidth } from '../utils/Responsive_Dimensions';

interface ToggleSwitchProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  width?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
}

const AppToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onToggle,
  width = responsiveWidth(13),
  height = responsiveWidth(7),
  activeColor = AppColors.ThemeBlue,
  inactiveColor = AppColors.disable,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width - height + 2],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <TouchableWithoutFeedback onPress={() => onToggle(!value)}>
      <Animated.View
        style={[
          styles.container,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              width: height - 4,
              height: height - 4,
              borderRadius: (height - 4) / 2,
              transform: [{ translateX: toggleTranslateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AppToggleSwitch;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 2,
  },
  circle: {
    backgroundColor: '#fff',
    elevation: 3,
  },
});