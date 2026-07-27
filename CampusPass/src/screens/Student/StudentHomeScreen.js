import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, useTheme, Chip, IconButton } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import eventService from "../../services/eventService";
import SearchBar from "../../components/inputs/SearchBar";
import EventCard from "../../components/cards/EventCard";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const StudentHomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      const [categoriesRes, featuredRes, eventsRes] = await Promise.all([
        eventService.getCategories(),
        eventService.getFeaturedEvents(),
        eventService.getAllEvents(),
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (featuredRes.success) setFeaturedEvents(featuredRes.data);
      if (eventsRes.success) setAllEvents(eventsRes.data);
    } catch (err) {
      setError(err.message || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <LoadingState message="Loading events..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadData} />;
  }

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("EventDetails", { eventId: item._id })}
      style={styles.featuredCard}
    >
      {item.poster ? (
        <Image source={{ uri: item.poster }} style={styles.featuredImage} />
      ) : (
        <View style={[styles.featuredFallback, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="image" size={32} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcome, { color: theme.colors.outline }]}>Explore</Text>
          <Text style={[styles.brand, { color: theme.colors.onBackground }]}>CampusPass Events</Text>
        </View>
        <IconButton
          icon="bell-outline"
          size={24}
          iconColor={theme.colors.primary}
          onPress={() => navigation.navigate("Notifications")}
        />
      </View>

      {/* Search Bar Redirect */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Search")}
        style={styles.searchPlaceholder}
      >
        <SearchBar placeholder="Search events, organizers..." disabled />
      </TouchableOpacity>

      {/* Categories chips */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {categories.map((category) => (
            <Chip
              key={category._id}
              mode="flat"
              onPress={() => navigation.navigate("CategoryEvents", { categoryId: category._id, categoryName: category.name })}
              style={styles.chip}
              textStyle={{ fontSize: 13, fontWeight: "600" }}
              icon={() => (
                <MaterialCommunityIcons name="tag-outline" size={14} color={theme.colors.primary} />
              )}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Featured Events</Text>
          <FlatList
            horizontal
            data={featuredEvents}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
      )}

      {/* All Events */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Upcoming Events</Text>
        {allEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={48} color={theme.colors.outline} />
            <Text style={{ marginTop: 8, color: theme.colors.outline }}>No events scheduled yet.</Text>
          </View>
        ) : (
          allEvents.map((item) => (
            <EventCard
              key={item._id}
              event={item}
              onPress={() => navigation.navigate("EventDetails", { eventId: item._id })}
            />
          ))
        )}
      </View>
    </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcome: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchPlaceholder: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
  },
  chipScroll: {
    paddingLeft: 16,
  },
  chip: {
    marginRight: 8,
    height: 36,
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCard: {
    width: 220,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredFallback: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  featuredTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
});

export default StudentHomeScreen;
