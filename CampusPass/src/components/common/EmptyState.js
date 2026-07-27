import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PrimaryButton from "./PrimaryButton";

const EmptyState = ({
  icon = "calendar-question",
  title = "No Data Found",
  description = "There is nothing to display here at the moment.",
  actionLabel,
  onAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name={icon}
        size={64}
        color={theme.colors.outline}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        {description}
      </Text>
      {actionLabel && onAction ? (
        <PrimaryButton onPress={onAction} style={styles.button}>
          {actionLabel}
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
    opacity: 0.8,
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

export default EmptyState;
