import React from "react";
import { StyleSheet } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";

const SearchBar = ({
  placeholder = "Search events...",
  value,
  onChangeText,
  onSubmitEditing,
  onClear,
  style,
}) => {
  const theme = useTheme();

  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      onSubmitEditing={onSubmitEditing}
      onClearIconPress={onClear}
      iconColor={theme.colors.primary}
      style={[
        styles.searchbar,
        {
          borderRadius: theme.roundness,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      inputStyle={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  searchbar: {
    height: 48,
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
    marginVertical: 8,
  },
  input: {
    minHeight: 48,
    alignSelf: "center",
  },
});

export default SearchBar;
