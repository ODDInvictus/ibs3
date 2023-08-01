<script lang="ts">
  import SpotifyWebApi from "spotify-web-api-node";
  import { onMount } from "svelte";
  import { toast } from "$lib/notification";
  import Title from "$lib/components/title.svelte";
  import Login from "./Login.svelte";
  import Tracklist from "./Tracklist.svelte";
  import { accesstokenStore } from "./store";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  const clientId = "f6ee1ca223f040dab56032aa95f2c9f1";
  const redirectUri = "http://localhost:5173/playlist/callback";

  const spotify = new SpotifyWebApi({
    clientId,
    redirectUri,
  });

  const searchParams = $page.url.searchParams;
  const data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } | null = searchParams.has("data")
    ? JSON.parse(searchParams.get("data")!)
    : null;
  const error = searchParams.get("error");

  accesstokenStore.subscribe((value) => {
    if (value) spotify.setAccessToken(value);
  });

  let mounted = false;

  onMount(() => {
    if (error)
      toast({
        title: "Error",
        message: error,
        type: "error",
      });

    if (data) {
      accesstokenStore.set(data.access_token);
      $page.url.searchParams.delete("data");
      goto(`?${$page.url.searchParams.toString()}`);
    }

    mounted = true;
  });

  let search = "";
  $: tracks =
    spotify.getAccessToken() && search ? spotify.searchTracks(search) : null;
</script>

<Title title="Playlist" />
<main>
  {#if mounted}
    {#if !data && !spotify.getAccessToken()}
      <Login />
    {:else}
      <input
        type="text"
        name="search"
        bind:value={search}
        placeholder="Zoeken..."
      />

      {#await tracks}
        <p>loading...</p>
      {:then tracks}
        {#if tracks?.body?.tracks?.items !== undefined}
          <Tracklist tracks={tracks.body.tracks.items} {search} />
        {/if}
      {:catch error}
        <Login />
        <p>error: {error.message}</p>
      {/await}
    {/if}
  {:else}
    <p>loading...</p>
  {/if}
</main>

<style>
  input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
