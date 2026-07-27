import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, useTheme } from "react-native-paper";
import eventService from "../../services/eventService";
import SearchBar from "../../components/inputs/SearchBar";
import EventCard from "../../components/cards/EventCard";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const SearchScreen = ({ navigation }) => {
  const theme = useTheme();
  const [keyword, setKeyword] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await eventService.searchEvents(keyword);
      if (response.success) {
        setEvents(response.data);
      } else {
        setError(response.message || "Search failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setKeyword("");
    setEvents([]);
    setSearched(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          onClear={handleClear}
          placeholder="Type event name and press search..."
          style={styles.searchbar}
        />
      </View>

      {loading ? (
        <LoadingState message="Searching events..." fullScreen={true} />
      ) : error ? (
        <ErrorState error={error} onRetry={handleSearch} />
      ) : searched && events.length === 0 ? (
        <EmptyState
          icon="calendar-search"
          title="No Match Found"
          description={`We couldn't find any events matching "${keyword}". Try another query.`}
        />
      ) : !searched ? (
        <View style={styles.introContainer}>
          <Text style={{ color: theme.colors.outline, textAlign: "center" }}>
            Search campus events by their titles or keyword phrases.
          </Text>
        </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchbar: {
    marginVertical: 4,
  },
  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
});

export default SearchScreen;
