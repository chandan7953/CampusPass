import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme, Card, Divider, Button, Avatar, List } from "react-native-paper";
import Toast from "react-native-toast-message";
import adminService from "../../services/adminService";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const AdminUserDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { userId } = route.params;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const loadUserDetails = async () => {
    try {
      setError(null);
      const response = await adminService.getUserById(userId);
      if (response.success) {
        setUser(response.data);
      } else {
        setError(response.message || "Failed to load user details");
      }
    } catch (err) {
      setError(err.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const handleToggleBlock = async () => {
    setUpdating(true);
    const isCurrentlyBlocked = user.status === "blocked" || user.isBlocked;
    try {
      let response;
      if (isCurrentlyBlocked) {
        response = await adminService.unblockUser(userId);
      } else {
        response = await adminService.blockUser(userId);
      }

      if (response.success) {
        Toast.show({
          type: "success",
          text1: isCurrentlyBlocked ? "User Unblocked" : "User Blocked",
        });
        loadUserDetails();
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Operation Failed",
        text2: err.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingState message="Fetching profile details..." />;
  }

  if (error || !user) {
    return <ErrorState error={error || "User record not found"} onRetry={loadUserDetails} />;
  }

  const isUserBlocked = user.status === "blocked" || user.isBlocked;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.center}>
          {user.profileImage ? (
            <Avatar.Image size={80} source={{ uri: user.profileImage }} />
          ) : (
            <Avatar.Text size={80} label={user.fullName?.substring(0, 2).toUpperCase() || "US"} />
          )}
          <Text style={[styles.name, { color: theme.colors.onBackground }]}>{user.fullName}</Text>
          <Text style={[styles.role, { color: theme.colors.primary }]}>{user.role.toUpperCase()}</Text>
        </Card.Content>
      </Card>

      <Card style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]}>
        <List.Section>
          <List.Subheader>Account Profile Details</List.Subheader>
          <List.Item title="Email" description={user.email} left={(p) => <List.Icon {...p} icon="email-outline" />} />
          <Divider />
          <List.Item title="Mobile" description={user.mobile} left={(p) => <List.Icon {...p} icon="phone-outline" />} />
          <Divider />
          {user.role === "student" && (
            <>
              <List.Item title="Department" description={user.department || "N/A"} left={(p) => <List.Icon {...p} icon="domain" />} />
              <Divider />
              <List.Item title="Year" description={user.year || "N/A"} left={(p) => <List.Icon {...p} icon="school" />} />
              <Divider />
            </>
          )}
          <List.Item
            title="Account Verification Status"
            description={user.isVerified ? "Verified Email Address" : "Unverified Account"}
            left={(p) => (
              <List.Icon
                {...p}
                icon={user.isVerified ? "check-decagram-outline" : "alert-outline"}
                color={user.isVerified ? theme.colors.success : theme.colors.warning}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Ban Block Status"
            description={isUserBlocked ? "Suspended / Blocked" : "Active / Standard"}
            left={(p) => (
              <List.Icon
                {...p}
                icon={isUserBlocked ? "account-off-outline" : "account-check-outline"}
                color={isUserBlocked ? theme.colors.error : theme.colors.success}
              />
            )}
          />
        </List.Section>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          loading={updating}
          disabled={updating}
          onPress={handleToggleBlock}
          style={{
            backgroundColor: isUserBlocked ? theme.colors.success : theme.colors.error,
            borderRadius: theme.roundness,
          }}
        >
          {isUserBlocked ? "Unblock User Account" : "Block User Account"}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    elevation: 2,
    paddingVertical: 20,
    borderRadius: 12,
  },
  center: {
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  role: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    letterSpacing: 1,
  },
  detailsCard: {
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  actions: {
    marginVertical: 24,
    paddingBottom: 24,
  },
});

export default AdminUserDetailScreen;
