import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/inputs/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import adminService from "../../services/adminService";

const AddVenueScreen = ({ navigation }) => {
  const theme = useTheme();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !address.trim() || !collegeName.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Name, address, and college name are required.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminService.createVenue({
        name: name.trim(),
        address: address.trim(),
        collegeName: collegeName.trim(),
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Venue Registered",
          text2: "Venue registered successfully",
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to create",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      Toast.show({
        type: "error",
        text1: "Failed to create",
        text2: message,
      });
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
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>New Campus Venue</Text>

        <CustomInput
          label="Venue Location Name (e.g. Main Auditorium)"
          value={name}
          onChangeText={setName}
          leftIcon="map-marker-outline"
        />

        <CustomInput
          label="Detailed Physical Address"
          value={address}
          onChangeText={setAddress}
          placeholder="e.g. Block B, Ground Floor, Campus East"
          leftIcon="text"
        />

        <CustomInput
          label="College Name"
          value={collegeName}
          onChangeText={setCollegeName}
          placeholder="e.g. Institute of Technology"
          leftIcon="school-outline"
        />

        <CustomInput
          label="Latitude (Optional)"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
          placeholder="e.g. 12.9716"
          leftIcon="compass-outline"
        />

        <CustomInput
          label="Longitude (Optional)"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
          placeholder="e.g. 77.5946"
          leftIcon="compass-outline"
        />

        <PrimaryButton
          onPress={handleSave}
          loading={submitting}
          style={styles.button}
        >
          Create Venue
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
  button: {
    marginTop: 24,
  },
});

export default AddVenueScreen;
