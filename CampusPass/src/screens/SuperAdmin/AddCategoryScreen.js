import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import CustomInput from "../../components/inputs/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import adminService from "../../services/adminService";

const AddCategoryScreen = ({ navigation }) => {
  const theme = useTheme();
  
  const [name, setName] = useState("");
  const [iconUri, setIconUri] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePickIcon = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Media library access is needed to select category icon.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        setIconUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log("Icon picking error", err);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Category name is required" });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());

      if (iconUri) {
        const uriParts = iconUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("icon", {
          uri: iconUri,
          name: `icon.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await adminService.createCategory(formData);
      if (response.success) {
        Toast.show({ type: "success", text1: "Category Created Successfully" });
        navigation.goBack();
      } else {
        Toast.show({ type: "error", text1: "Failed to create", text2: response.message });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      Toast.show({ type: "error", text1: "Failed to create", text2: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>New Category</Text>

        <TouchableOpacity onPress={handlePickIcon} activeOpacity={0.8}>
          <View style={[styles.iconPicker, { borderColor: theme.colors.outline }]}>
            {iconUri ? (
              <Image source={{ uri: iconUri }} style={styles.iconImage} />
            ) : (
              <View style={styles.pickerInner}>
                <MaterialCommunityIcons name="tag-plus-outline" size={40} color={theme.colors.primary} />
                <Text style={{ marginTop: 8, fontWeight: "600" }}>Upload Category Icon (Optional)</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <CustomInput
          label="Category Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Technical, Cultural, Hackathons"
          leftIcon="tag"
        />

        <PrimaryButton
          onPress={handleSave}
          loading={submitting}
          style={styles.button}
        >
          Create Category
        </PrimaryButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  iconPicker: {
    width: "100%",
    height: 120,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  iconImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  pickerInner: {
    alignItems: "center",
  },
  button: {
    marginTop: 24,
  },
});

export default AddCategoryScreen;
