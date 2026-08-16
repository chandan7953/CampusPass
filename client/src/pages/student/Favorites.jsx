import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, RefreshCcw } from "lucide-react";

import toast from "react-hot-toast";
import api from "../../api/axios";

import PageHeader from "../../components/PageHeader";
import EventCard from "../../components/EventCard";
import EmptyState from "../../components/EmptyState";

const Favorites = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users/favorites");

      setFavorites(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load saved favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      await api.delete(`/users/favorites/${eventId}`);

      setFavorites((prev) =>
        prev.filter((fav) => {
          const event = fav.event || fav;

          return (event._id || event.id) !== eventId;
        })
      );

      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove favorite");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="SAVED BOOKMARKS"
        title="My Favorite Events"
        subtitle="
        Your saved campus experiences,
        events and activities.
        "
        action={
          <button
            onClick={fetchFavorites}
            className="
          flex
          items-center
          gap-2
          rounded-2xl
          border
          border-border
          bg-surface
          px-4
          py-2.5
          text-xs
          font-bold
          text-text
          transition
          hover:bg-primary/10
          "
          >
            <RefreshCcw size={15} />
            Refresh
          </button>
        }
      />

      {!loading && favorites.length > 0 && (
        <div
          className="
        flex
        items-center
        gap-3
        rounded-3xl
        border
        border-border
        bg-surface
        p-5
        "
        >
          <div
            className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-primary/10
          text-primary
          "
          >
            <Heart size={24} className="fill-primary" />
          </div>

          <div>
            <p
              className="
            text-lg
            font-black
            text-text
            "
            >
              {favorites.length} Saved Events
            </p>

            <p
              className="
            text-xs
            text-text-muted
            "
            >
              Quickly access events you are interested in.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div
          className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          "
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                h-80
                rounded-3xl
                border
                border-border
                bg-surface
                animate-pulse
                "
            />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          title="No Favorites Saved"
          description="
          Save interesting events by clicking
          the heart icon on event cards.
          "
          icon={Heart}
          action={
            <button
              onClick={() => navigate("/browse")}
              className="
            rounded-2xl
            bg-primary
            px-6
            py-3
            text-xs
            font-bold
            text-background
            transition
            hover:opacity-90
            "
            >
              Explore Events
            </button>
          }
        />
      ) : (
        <div
          className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          "
        >
          {favorites.map((fav) => {
            const event = fav.event || fav;

            if (!event || !event.title) return null;

            return (
              <EventCard
                key={fav._id || event._id}
                event={event}
                onView={() => navigate(`/event/${event._id || event.id}`)}
                onRemoveFavorite={() => removeFavorite(event._id || event.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
