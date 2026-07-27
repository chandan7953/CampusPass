import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { Text, useTheme, Card, List, Chip } from "react-native-paper";
import adminService from "../../services/adminService";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const AdminApprovalsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      setError(null);
      const response = await adminService.getAllEvents();
      if (response.success) {
        // Filter events that are not approved yet (e.g. status: draft / pending)
        const pending = response.data.filter((e) => e.status === "draft" || e.approvalStatus !== "approved");
        setEvents(pending);
      } else {
        setError(response.message || "Failed to load events");
      }
    } catch (err) {
      setError(err.message || "Failed to load events");
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

  if (loading) {
    return <LoadingState message="Checking pending events list..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadEvents} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {events.length === 0 ? (
        <EmptyState
          icon="calendar-check"
          title="No Pending Approvals"
          description="All event listing requests have been reviewed and processed."
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate("AdminEventDetail", { eventId: item._id })}
            >
              <Card.Content>
                <List.Item
                  title={item.title}
                  description={`Organizer: ${item.organizer?.fullName || "N/A"}\nDate: ${new Date(item.startDate).toLocaleDateString()}`}
                  titleStyle={{ fontWeight: "bold" }}
                  descriptionStyle={{ fontSize: 13, marginTop: 4 }}
                  left={(props) => <List.Icon {...props} icon="calendar-clock" />}
                  right={() => (
                    <View style={styles.rightBadge}>
                      <Chip compact style={{ backgroundColor: theme.colors.warning }} textStyle={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}>
                        PENDING
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
    justifyContent: "center",
  },
});

export default AdminApprovalsScreen;
