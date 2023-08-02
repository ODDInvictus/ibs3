<script lang="ts">
  const clientId = "f6ee1ca223f040dab56032aa95f2c9f1";
  const redirectUri = "http://localhost:5173/playlist/callback";
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private"
  ];
  const state = generateRandomString(16);

  function generateRandomString(length: number) {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  $: authorizeURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}&state=${state}`;
</script>

<a id="login-btn" href={authorizeURL}> Login met Spotify </a>

<style lang="scss">
  #login-btn {
    background-color: #1db954;
    padding: 10px;
    color: white;
    border-radius: 25px;
    text-decoration: none;
    margin-top: 20px;

    &:hover {
      background-color: #1ed760;
    }
  }
</style>
