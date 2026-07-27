import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { Text, useTheme, Button, List, IconButton, Divider } from "react-native-paper";
import Toast from "react-native-toast-message";
import notificationService from "../../services/notificationService";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const NotificationCenterScreen = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    try {
      setError(null);
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError(response.message || "Failed to load notifications");
      }
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.log("Error marking read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        Toast.show({
          type: "success",
          text1: "All Marked as Read",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await notificationService.deleteNotification(id);
      if (response.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        Toast.show({
          type: "success",
          text1: "Notification Deleted",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: err.message,
      });
    }
  };

  if (loading) {
    return <LoadingState message="Checking notifications..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadNotifications} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {notifications.length > 0 && (
        <View style={styles.actionsBar}>
          <Button icon="email-open-outline" onPress={handleMarkAllRead}>
            Mark All Read
          </Button>
        </View>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          icon="bell-off-outline"
          title="All Caught Up!"
          description="You don't have any notifications at the moment. We'll let you know when things happen."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <List.Item
                title={item.title}
                description={item.message}
                titleStyle={[
                  styles.title,
                  { fontWeight: item.isRead ? "normal" : "bold" },
                ]}
                descriptionStyle={[
                  styles.desc,
                  { color: item.isRead ? theme.colors.outline : theme.colors.onSurface },
                ]}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={item.isRead ? "bell-outline" : "bell"}
                    color={item.isRead ? theme.colors.outline : theme.colors.primary}
                  />
                )}
                right={() => (
                  <View style={styles.rightActions}>
                    {!item.isRead && (
                      <IconButton
                        icon="check"
                        size={20}
                        iconColor={theme.colors.success}
                        onPress={() => handleMarkAsRead(item._id)}
                      />
                    )}
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      iconColor={theme.colors.error}
                      onPress={() => handleDelete(item._id)}
                    />
                  </View>
                )}
                style={[
                  styles.item,
                  {
                    backgroundColor: item.isRead
                      ? "transparent"
                      : theme.colors.primaryContainer + "10", // 10% opacity
                  },
                ]}
              />
              <Divider />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 15,
  },
  desc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default NotificationCenterScreen;
