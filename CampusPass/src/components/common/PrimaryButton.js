import React from "react";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

const PrimaryButton = ({
  children,
  onPress,
  loading = false,
  disabled = false,
  style,
  icon,
  mode = "contained",
}) => {
  const theme = useTheme();

  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      style={[
        styles.button,
        {
          borderRadius: theme.roundness,
        },
        mode === "contained" && { backgroundColor: theme.colors.primary },
        style,
      ]}
      labelStyle={styles.label}
      contentStyle={styles.content}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default PrimaryButton;
