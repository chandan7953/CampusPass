import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { Text, useTheme, Card, Button, Chip, FAB, Divider } from "react-native-paper";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import eventService from "../../services/eventService";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const OrganizerEventsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      setError(null);
      const response = await eventService.getMyEvents();
      if (response.success) {
        setEvents(response.data);
      } else {
        setError(response.message || "Failed to fetch your events");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadEvents();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const handlePublish = async (id) => {
    try {
      const response = await eventService.publishEvent(id);
      if (response.success) {
        Toast.show({ type: "success", text1: "Event Published" });
        loadEvents();
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to publish", text2: err.message });
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await eventService.cancelEvent(id);
      if (response.success) {
        Toast.show({ type: "success", text1: "Event Cancelled" });
        loadEvents();
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to cancel", text2: err.message });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return theme.colors.success;
      case "draft":
        return theme.colors.warning;
      case "cancelled":
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  if (loading) {
    return <LoadingState message="Fetching your events..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadEvents} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {events.length === 0 ? (
        <EmptyState
          icon="calendar-plus"
          title="No Events Created"
          description="Create your first campus event to get started. You can add registration tickets, venues, and descriptions."
          actionLabel="Create Event"
          onAction={() => navigation.navigate("CreateEvent")}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text style={[styles.title, { color: theme.colors.onBackground }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Chip compact style={{ backgroundColor: getStatusColor(item.status) }} textStyle={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}>
                    {item.status.toUpperCase()}
                  </Chip>
                </View>
                <Text style={{ color: theme.colors.outline, fontSize: 13, marginVertical: 4 }}>
                  Date: {new Date(item.startDate).toLocaleDateString()} | Booked: {item.bookedSeats}/{item.capacity}
                </Text>

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.actionsRow}>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => navigation.navigate("EditEvent", { eventId: item._id })}
                    style={styles.actionBtn}
                  >
                    Edit Event
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => navigation.navigate("TicketManagement", { eventId: item._id, eventTitle: item.title })}
                    style={styles.actionBtn}
                  >
                    Tickets
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => navigation.navigate("EventAttendees", { eventId: item._id, eventTitle: item.title })}
                    style={styles.actionBtn}
                  >
                    Attendees
                  </Button>
                </View>

                {item.status === "draft" && (
                  <Button
                    mode="contained"
                    onPress={() => handlePublish(item._id)}
                    style={{ marginTop: 10 }}
                  >
                    Publish Event
                  </Button>
                )}

                {item.status === "published" && (
                  <Button
                    mode="text"
                    textColor={theme.colors.error}
                    onPress={() => handleCancel(item._id)}
                    style={{ marginTop: 4 }}
                  >
                    Cancel Event
                  </Button>
                )}
              </Card.Content>
            </Card>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 80 }}
        />
      )}

      {/* Floating Action Button to Create Event */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#FFF"
        onPress={() => navigation.navigate("CreateEvent")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 2,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default OrganizerEventsScreen;
