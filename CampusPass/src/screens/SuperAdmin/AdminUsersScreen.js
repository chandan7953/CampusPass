import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { Text, useTheme, Card, List, Chip } from "react-native-paper";
import adminService from "../../services/adminService";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const AdminUsersScreen = ({ navigation }) => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      setError(null);
      const response = await adminService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message || "Failed to load users list");
      }
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUsers();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  if (loading) {
    return <LoadingState message="Fetching all user records..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadUsers} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {users.length === 0 ? (
        <EmptyState icon="account-off" title="No Users Registered" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate("AdminUserDetail", { userId: item._id })}
            >
              <Card.Content>
                <List.Item
                  title={item.fullName}
                  description={`Email: ${item.email}\nMobile: ${item.mobile}`}
                  titleStyle={{ fontWeight: "bold" }}
                  descriptionStyle={{ fontSize: 13, marginTop: 4 }}
                  left={(props) => <List.Icon {...props} icon="account" />}
                  right={() => (
                    <View style={styles.rightBadge}>
                      <Chip compact style={{ backgroundColor: theme.colors.primary, marginBottom: 4 }} textStyle={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}>
                        {item.role.toUpperCase()}
                      </Chip>
                      <Chip
                        compact
                        style={{
                          backgroundColor: item.status === "blocked" || item.isBlocked ? theme.colors.error : theme.colors.success,
                        }}
                        textStyle={{ color: "#FFF", fontSize: 9, fontWeight: "bold" }}
                      >
                        {item.status === "blocked" || item.isBlocked ? "BLOCKED" : "ACTIVE"}
                      </Chip>
                    </View>
                  )}
                />
              </Card.Content>
            </Card>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 4,
    marginHorizontal: 16,
    elevation: 1,
  },
  rightBadge: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default AdminUsersScreen;
