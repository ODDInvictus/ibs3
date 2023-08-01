<script lang="ts">
  import SpotifyWebApi from "spotify-web-api-node";
  import { onMount } from "svelte";
  import { toast } from "$lib/notification";
  import Title from "$lib/components/title.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Login from "../Login.svelte";
  import Tracklist from "./Tracklist.svelte";
  import { accesstokenStore } from "../store";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

	import type { PageServerData } from "./$types";

  export let data: PageServerData;

  const clientId = "f6ee1ca223f040dab56032aa95f2c9f1";
  const redirectUri = "http://localhost:5173/playlist/callback";

  const spotify = new SpotifyWebApi({
    clientId,
    redirectUri,
  });

  const searchParams = $page.url.searchParams;
  const tokens: {
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

    if (tokens) {
      accesstokenStore.set(tokens.access_token);
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
    {#if !tokens && !spotify.getAccessToken()}
      <Login />
    {:else}
      <input
        type="text"
        name="search"
        bind:value={search}
        placeholder="Zoeken..."
      />

      {#await tracks}
        <Loader />
      {:then tracks}
        {#if tracks?.body?.tracks?.items !== undefined}
          <Tracklist tracks={tracks.body.tracks.items} {search} liked={data.liked} />
        {/if}
      {:catch error}
        <Login />
        <p>error: {error.message}</p>
      {/await}
    {/if}
  {:else}
    <Loader />
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
