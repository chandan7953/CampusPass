import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { Text, useTheme, Card, List, Button, IconButton, Divider } from "react-native-paper";
import Toast from "react-native-toast-message";

import adminService from "../../services/adminService";
import eventService from "../../services/eventService";
import LoadingState from "../../components/common/LoadingState";

const AdminSettingsScreen = ({ navigation }) => {
  const theme = useTheme();

  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [catRes, venueRes] = await Promise.all([
        eventService.getCategories(),
        eventService.getVenues(),
      ]);

      if (catRes.success) setCategories(catRes.data);
      if (venueRes.success) setVenues(venueRes.data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Load Error",
        text2: err.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await adminService.deleteCategory(id);
      if (res.success) {
        Toast.show({ type: "success", text1: "Category Deleted" });
        loadData();
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Delete Failed", text2: err.message });
    }
  };

  const handleDeleteVenue = async (id) => {
    try {
      const res = await adminService.deleteVenue(id);
      if (res.success) {
        Toast.show({ type: "success", text1: "Venue Deleted" });
        loadData();
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Delete Failed", text2: err.message });
    }
  };

  if (loading) {
    return <LoadingState message="Loading platform settings..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Categories section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Event Categories</Text>
          <Button icon="plus" mode="text" onPress={() => navigation.navigate("AddCategory")}>
            Add Category
          </Button>
        </View>

        <Card style={{ backgroundColor: theme.colors.surface }}>
          {categories.length === 0 ? (
            <List.Item title="No categories defined." titleStyle={{ color: theme.colors.outline }} />
          ) : (
            categories.map((item) => (
              <View key={item._id}>
                <List.Item
                  title={item.name}
                  left={(props) => <List.Icon {...props} icon="tag-outline" />}
                  right={() => (
                    <IconButton
                      icon="delete-outline"
                      iconColor={theme.colors.error}
                      size={20}
                      onPress={() => handleDeleteCategory(item._id)}
                    />
                  )}
                />
                <Divider />
              </View>
            ))
          )}
        </Card>
      </View>

      {/* Venues section */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Campus Venues</Text>
          <Button icon="plus" mode="text" onPress={() => navigation.navigate("AddVenue")}>
            Add Venue
          </Button>
        </View>

        <Card style={{ backgroundColor: theme.colors.surface }}>
          {venues.length === 0 ? (
            <List.Item title="No venues registered." titleStyle={{ color: theme.colors.outline }} />
          ) : (
            venues.map((item) => (
              <View key={item._id}>
                <List.Item
                  title={item.name}
                  description={`${item.collegeName} - ${item.address}`}
                  descriptionStyle={{ fontSize: 12 }}
                  left={(props) => <List.Icon {...props} icon="map-marker-outline" />}
                  right={() => (
                    <IconButton
                      icon="delete-outline"
                      iconColor={theme.colors.error}
                      size={20}
                      onPress={() => handleDeleteVenue(item._id)}
                    />
                  )}
                />
                <Divider />
              </View>
            ))
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdminSettingsScreen;
