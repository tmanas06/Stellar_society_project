import axios from "axios"; 

const authEndpoint = "https://accounts.spotify.com/authorize?";
const clientId = "573301f29ccc4880bb3ca1d0b48aff96";
const redirectUri = "http://localhost:3000";
const scopes = ["user-library-read", "playlist-read-private"];

export const loginEndpoint = `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

const apiClient = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

let accessToken = ""; // Variable to store the current access token

export const setClientToken = (token) => {
  accessToken = token;

  apiClient.interceptors.request.use(async function (config) {
    config.headers.Authorization = "Bearer " + accessToken;
    return config;
  });
};

export const getAccessToken = () => {
  return accessToken;
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      const newAccessToken = response.data.access_token;
      setClientToken(newAccessToken);
      return newAccessToken;
    } else {
      console.error("Error refreshing access token:", response);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

export default apiClient;
