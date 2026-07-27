import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Text, useTheme, Button, Avatar, List, Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { logout, updateUser } from "../../redux/slices/authSlice";
import profileService from "../../services/profileService";
import LoadingState from "../../components/common/LoadingState";

const ProfileHomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Media library permissions are required to change photo.",
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
        setUploading(true);
        const uploadRes = await profileService.uploadProfileImage(result.assets[0].uri);
        
        if (uploadRes.success) {
          dispatch(updateUser({ profileImage: uploadRes.data.profileImage }));
          Toast.show({
            type: "success",
            text1: "Avatar Updated",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2: uploadRes.message,
          });
        }
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Upload Error",
        text2: err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    Toast.show({
      type: "success",
      text1: "Logged Out",
      text2: "Have a great day!",
    });
  };

  if (!user) {
    return <LoadingState message="Loading profile..." />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Profile Info */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} disabled={uploading}>
          <View style={styles.avatarContainer}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            ) : (
              <Avatar.Text
                size={80}
                label={user.fullName?.substring(0, 2).toUpperCase() || "CP"}
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
            <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="camera" size={14} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={[styles.name, { color: theme.colors.onBackground }]}>{user.fullName}</Text>
        <Text style={[styles.role, { color: theme.colors.primary }]}>
          {user.role?.toUpperCase()}
        </Text>
      </View>

      {/* Account Details */}
      <View style={styles.section}>
        <List.Section>
          <List.Subheader>Account Information</List.Subheader>
          <List.Item
            title="Email"
            description={user.email}
            left={(props) => <List.Icon {...props} icon="email-outline" />}
          />
          <Divider />
          <List.Item
            title="Mobile"
            description={user.mobile}
            left={(props) => <List.Icon {...props} icon="phone-outline" />}
          />
          <Divider />
          
          {user.role === "student" && (
            <>
              <List.Item
                title="Department"
                description={user.department || "Not specified"}
                left={(props) => <List.Icon {...props} icon="domain" />}
              />
              <Divider />
              <List.Item
                title="Year"
                description={user.year || "Not specified"}
                left={(props) => <List.Icon {...props} icon="school-outline" />}
              />
              <Divider />
            </>
          )}

          <List.Item
            title="Verification Status"
            description={user.isVerified ? "Verified User" : "Unverified (Verification Needed)"}
            left={(props) => (
              <List.Icon
                {...props}
                icon={user.isVerified ? "checkbox-marked-circle-outline" : "alert-decagram-outline"}
                color={user.isVerified ? theme.colors.success : theme.colors.warning}
              />
            )}
            right={() =>
              !user.isVerified ? (
                <Button
                  mode="text"
                  onPress={() => navigation.navigate("OTPVerification", { email: user.email })}
                >
                  Verify Now
                </Button>
              ) : null
            }
          />
        </List.Section>
      </View>

      {/* Settings Options */}
      <View style={styles.section}>
        <List.Section>
          <List.Subheader>Settings & Security</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={(props) => <List.Icon {...props} icon="account-edit-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("EditProfile")}
          />
          <Divider />
          <List.Item
            title="Change Password"
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <Divider />
          {user.role === "student" && (
            <>
              <List.Item
                title="My Bookmarked Favorites"
                left={(props) => <List.Icon {...props} icon="heart-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate("Favorites")}
              />
              <Divider />
            </>
          )}
        </List.Section>
      </View>

      {/* Logout Action */}
      <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
        <Button
          mode="outlined"
          textColor={theme.colors.error}
          style={{ borderColor: theme.colors.error, borderRadius: theme.roundness }}
          onPress={handleLogout}
          icon="logout"
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  role: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    letterSpacing: 1,
  },
  section: {
    marginTop: 12,
    backgroundColor: "#FFF",
  },
});

export default ProfileHomeScreen;
