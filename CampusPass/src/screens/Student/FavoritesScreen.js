import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import profileService from "../../services/profileService";
import EventCard from "../../components/cards/EventCard";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const FavoritesScreen = ({ navigation }) => {
  const theme = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadFavorites = async () => {
    try {
      setError(null);
      const response = await profileService.getFavorites();
      if (response.success) {
        setFavorites(response.data);
      } else {
        setError(response.message || "Failed to load favorites");
      }
    } catch (err) {
      setError(err.message || "Failed to load favorites");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  if (loading) {
    return <LoadingState message="Fetching favorites..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadFavorites} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No Favorites Bookmarked"
          description="Bookmark your favorite campus events by tapping the heart icon on any event details page."
          actionLabel="Explore Events"
          onAction={() => navigation.navigate("Home")}
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate("EventDetails", { eventId: item._id })}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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

export default FavoritesScreen;
