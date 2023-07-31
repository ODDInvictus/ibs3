<script lang="ts">
  import Title from "$lib/components/title.svelte";
  import { toast } from "$lib/notification";
  import { onMount } from "svelte";
  import Login from "./Login.svelte";
  import SpotifyWebApi from "spotify-web-api-node";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  const clientId = "f6ee1ca223f040dab56032aa95f2c9f1";
  const redirectUri = "http://localhost:5173/playlist/callback";

  const spotify = new SpotifyWebApi({
    clientId,
    redirectUri,
  });

  const searchParams = $page.url.searchParams;
  const data = searchParams.has("data")
    ? JSON.parse(searchParams.get("data")!)
    : null;
  const error = searchParams.get("error");

  onMount(() => {
    if (error)
      toast({
        title: "Error",
        message: error,
        type: "error",
      });

    if (data) {
      spotify.setAccessToken(data.access_token);
      spotify.setRefreshToken(data.refresh_token);
      $page.url.searchParams.delete("data");
      goto(`?${$page.url.searchParams.toString()}`);
    }
  });

  let search = "";
  $: tracks = data && search ? spotify.searchTracks(search) : null;

  const getSmallestImage = (images: SpotifyApi.ImageObject[]) => {
    return images.reduce((smallest, image) => {
      if (image.height && image.width) {
        if (image.height < smallest.height! && image.width < smallest.width!)
          return image;
      }
      return smallest;
    }, images[0]);
  };

  const formatArtists = (artists: SpotifyApi.ArtistObjectSimplified[]) => {
    return artists.map((artist) => artist.name).join(", ");
  };
</script>

<Title title="Playlist" />
<main>
  {#if !data}
    <Login />
  {:else}
    <input type="text" name="search" bind:value={search} />

    {#await tracks}
      <p>loading...</p>
    {:then tracks}
      {#if !tracks?.body?.tracks?.items}
        <p>Geen resultaten gevonden</p>
      {:else}
        <ul>
          {#each tracks.body.tracks.items as track}
            <li>
              <img
                src={getSmallestImage(track.album.images).url}
                alt={track.name}
              />
              <div class="right">
                <p>{track.name}</p>
                <p class="artists">{formatArtists(track.artists)}</p>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    {/await}
  {/if}
</main>

<style lang="scss">
  ul {
    li {
      display: flex;

      .right {
        margin-left: 10px;

        .artists {
          font-size: 0.8rem;
          color: #888;
        }
      }

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
</style>
