import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { useTheme } from "react-native-paper";

const SkeletonLoader = ({ width = "100%", height = 100, style }) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: theme.roundness,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 6,
  },
});

export default SkeletonLoader;
