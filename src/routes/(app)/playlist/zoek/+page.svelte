<script lang="ts">
  import { onMount } from "svelte";
  import Title from "$lib/components/title.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Tracklist from "./Tracklist.svelte";
  import spotify from "../Spotify";
	import { goto } from "$app/navigation";

	import type { PageServerData } from "./$types";

  export let data: PageServerData;

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  let search = "";
  $: tracks =
    mounted && search ? spotify.searchTracks(search) : null;
</script>

<Title title="Playlist" />
<main>
  {#if mounted}
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
        <Tracklist tracks={tracks.body.tracks.items} {search} liked={data.liked} playlist={data.playlist} />
      {/if}
    {:catch error}
      {goto("/playlist/auth")}
    {/await}
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
