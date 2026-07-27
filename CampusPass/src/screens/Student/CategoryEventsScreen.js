import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, useTheme } from "react-native-paper";
import eventService from "../../services/eventService";
import EventCard from "../../components/cards/EventCard";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const CategoryEventsScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { categoryId, categoryName } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEventsByCategory(categoryId);
      if (response.success) {
        setEvents(response.data);
      } else {
        setError(response.message || "Failed to load events");
      }
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [categoryId]);

  if (loading) {
    return <LoadingState message={`Fetching ${categoryName} events...`} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadEvents} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {events.length === 0 ? (
        <EmptyState
          icon="calendar-blank"
          title={`No ${categoryName} Events`}
          description={`There are currently no scheduled events in the ${categoryName} category.`}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate("EventDetails", { eventId: item._id })}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CategoryEventsScreen;
