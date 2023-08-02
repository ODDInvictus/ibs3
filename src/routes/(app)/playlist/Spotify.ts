import SpotifyWebApi from "spotify-web-api-node";

const clientId = "f6ee1ca223f040dab56032aa95f2c9f1";
const redirectUri = "http://localhost:5173/playlist/callback";

export default new SpotifyWebApi({
  clientId,
  redirectUri,
});
