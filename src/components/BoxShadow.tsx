import React from 'react';
import { TouchableOpacity, View, ScrollView, StyleSheet, StyleProp, ViewStyle, TouchableOpacityProps, ScrollViewProps } from 'react-native';

type ScrollBoxProps = {
  scroll: true;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
} & Omit<ScrollViewProps, 'style'>;

type ClickableBoxProps = {
  scroll?: false;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
} & Omit<TouchableOpacityProps, 'style'>;

type BoxShadowProps = ScrollBoxProps | ClickableBoxProps;

const BoxShadow: React.FC<BoxShadowProps> = (props) => {
  const { children, style, scroll } = props;

  if (scroll) {
    const { scroll: _, ...scrollViewProps } = props as ScrollBoxProps;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.actionCard, style]}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  const { onPress, activeOpacity = 0.85, ...touchableProps } = props as ClickableBoxProps;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={[styles.actionCard, style]}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[styles.actionCard, style]}
      {...(touchableProps as any)}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  actionCard: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.00,
    elevation: 1
  },
});

export default BoxShadow;
