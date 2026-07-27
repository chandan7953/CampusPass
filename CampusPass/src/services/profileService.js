import api from "./api";

const profileService = {
  getProfile: async () => {
    const response = await api.get("/api/users/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    // profileData: { fullName, mobile, department, year }
    const response = await api.put("/api/users/profile", profileData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.patch("/api/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  uploadProfileImage: async (imageFileUri) => {
    const formData = new FormData();
    // Prepare native file format
    const uriParts = imageFileUri.split(".");
    const fileType = uriParts[uriParts.length - 1];
    formData.append("profileImage", {
      uri: imageFileUri,
      name: `profile.${fileType}`,
      type: `image/${fileType}`,
    });

    const response = await api.patch("/api/users/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  addFavorite: async (eventId) => {
    const response = await api.post(`/api/users/favorites/${eventId}`);
    return response.data;
  },

  removeFavorite: async (eventId) => {
    const response = await api.delete(`/api/users/favorites/${eventId}`);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get("/api/users/favorites");
    return response.data;
  },
};

export default profileService;
