import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";

const CustomInput = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  leftIcon,
  rightIcon,
  placeholder,
  style,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        disabled={disabled}
        mode="outlined"
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        style={[
          styles.input,
          multiline && { minHeight: 80 },
          { backgroundColor: theme.colors.surface },
        ]}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : null}
        right={rightIcon ? rightIcon : null}
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
    marginVertical: 6,
    width: "100%",
  },
  input: {
    fontSize: 15,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
});

export default CustomInput;
