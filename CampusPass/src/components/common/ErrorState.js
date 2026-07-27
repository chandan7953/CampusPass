import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PrimaryButton from "./PrimaryButton";

const ErrorState = ({
  error = "An error occurred while fetching data.",
  onRetry,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={64}
        color={theme.colors.error}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.colors.error }]}>
        Something went wrong
      </Text>
      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        {error}
      </Text>
      {onRetry ? (
        <PrimaryButton onPress={onRetry} icon="refresh" style={styles.button}>
          Try Again
        </PrimaryButton>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    minWidth: 160,
  },
});

export default ErrorState;
