import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { Text, useTheme, Card, Button, Divider, IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import eventService from "../../services/eventService";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const TicketManagementScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { eventId, eventTitle } = route.params;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadTickets = async () => {
    try {
      setError(null);
      const response = await eventService.getEventTickets(eventId);
      if (response.success) {
        setTickets(response.data);
      } else {
        setError(response.message || "Failed to load tickets");
      }
    } catch (err) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadTickets();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const handleDelete = async (id) => {
    try {
      const response = await eventService.deleteTicket(id);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Ticket Deleted",
        });
        loadTickets();
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to delete ticket",
        text2: err.message,
      });
    }
  };

  if (loading) {
    return <LoadingState message="Loading ticket tiers..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadTickets} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: theme.colors.outline }]} numberOfLines={1}>{eventTitle}</Text>
        <Button
          icon="plus"
          mode="contained"
          onPress={() => navigation.navigate("AddTicket", { eventId, eventTitle })}
          style={{ borderRadius: theme.roundness }}
        >
          Add Tier
        </Button>
      </View>

      {tickets.length === 0 ? (
        <EmptyState
          icon="ticket-outline"
          title="No Ticket Tiers"
          description="Create ticket tiers (e.g. Free Entry, VIP Pass, Early Bird) so students can book this event."
          actionLabel="Create Ticket Tier"
          onAction={() => navigation.navigate("AddTicket", { eventId, eventTitle })}
        />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ticketTitle, { color: theme.colors.onBackground }]}>{item.title}</Text>
                  <Text style={[styles.ticketDesc, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                    {item.description || "No description provided."}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", marginTop: 4 }}>
                    Price: ₹{item.price} | Qty: {item.remainingQuantity}/{item.quantity} remaining
                  </Text>
                </View>
                <IconButton
                  icon="trash-can-outline"
                  iconColor={theme.colors.error}
                  size={22}
                  onPress={() => handleDelete(item._id)}
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
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  card: {
    marginVertical: 4,
    marginHorizontal: 16,
    elevation: 1,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ticketDesc: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default TicketManagementScreen;
