import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { Text, useTheme, Card, List, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import organizerService from "../../services/organizerService";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const EventAttendeesScreen = ({ route }) => {
  const theme = useTheme();
  const { eventId, eventTitle } = route.params;

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadAttendees = async () => {
    try {
      setError(null);
      const response = await organizerService.getAttendees(eventId);
      if (response.success) {
        setAttendees(response.data);
      } else {
        setError(response.message || "Failed to load attendees");
      }
    } catch (err) {
      setError(err.message || "Failed to load attendees");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAttendees();
  }, [eventId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendees();
  };

  const handleExport = async () => {
    try {
      const response = await organizerService.exportAttendees(eventId);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Export Completed",
          text2: `Successfully exported ${response.data.length} attendees list to cache.`,
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Export Failed",
        text2: err.message,
      });
    }
  };

  if (loading) {
    return <LoadingState message="Loading attendees list..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadAttendees} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: theme.colors.outline }]}>{eventTitle}</Text>
        <Button icon="download" mode="text" onPress={handleExport} disabled={attendees.length === 0}>
          Export List
        </Button>
      </View>

      {attendees.length === 0 ? (
        <EmptyState
          icon="account-multiple-outline"
          title="No Registered Attendees"
          description="Nobody has booked a ticket for this event yet."
        />
      ) : (
        <FlatList
          data={attendees}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <List.Item
                  title={item.userId?.fullName || "Guest User"}
                  description={`Email: ${item.userId?.email || "N/A"}\nMobile: ${item.userId?.mobile || "N/A"}`}
                  titleStyle={{ fontWeight: "bold" }}
                  descriptionStyle={{ fontSize: 13, marginTop: 4 }}
                  left={(props) => <List.Icon {...props} icon="account" />}
                  right={() => (
                    <View style={styles.rightBadge}>
                      <Text style={[styles.qty, { color: theme.colors.primary }]}>Qty: {item.quantity}</Text>
                      <Text style={{ fontSize: 11, color: theme.colors.outline }}>{item.ticketId?.title}</Text>
                    </View>
                  )}
                />
              </Card.Content>
            </Card>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
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
  qty: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default EventAttendeesScreen;
