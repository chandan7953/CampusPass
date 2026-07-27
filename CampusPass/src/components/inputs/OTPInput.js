import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";

const OTPInput = ({ value, onChangeText, error }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={(text) => {
          // Only allow digits
          const cleaned = text.replace(/[^0-9]/g, "");
          onChangeText(cleaned);
        }}
        maxLength={6}
        keyboardType="number-pad"
        error={!!error}
        mode="outlined"
        placeholder="------"
        activeOutlineColor={theme.colors.primary}
        contentStyle={styles.text}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  input: {
    width: "80%",
    height: 60,
  },
  text: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 10,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
});

export default OTPInput;
