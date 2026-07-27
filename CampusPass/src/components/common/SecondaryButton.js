import React from "react";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

const SecondaryButton = ({
  children,
  onPress,
  loading = false,
  disabled = false,
  style,
  icon,
}) => {
  const theme = useTheme();

  return (
    <Button
      mode="outlined"
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      style={[
        styles.button,
        {
          borderRadius: theme.roundness,
          borderColor: theme.colors.outline,
        },
        style,
      ]}
      labelStyle={[styles.label, { color: theme.colors.primary }]}
      contentStyle={styles.content}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
  content: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default SecondaryButton;
