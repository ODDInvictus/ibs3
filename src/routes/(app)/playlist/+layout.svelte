<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { accesstokenStore } from "./store";
    import spotify from "./Spotify";

    onMount(() => {
        if (!browser) return;
        const t = sessionStorage.getItem("spotifyAccesstoken");
        if (t) accesstokenStore.set(t);
    });
</script>

<slot />