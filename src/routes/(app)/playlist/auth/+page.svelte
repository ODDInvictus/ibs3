<script lang="ts">
	import { page } from "$app/stores";
    import Title from "$lib/components/title.svelte";
    import Login from "./Login.svelte"
	import { onMount } from "svelte";
	import { accesstokenStore } from "../store";
	import { toast } from "$lib/notification";
	import { goto } from "$app/navigation";

    const searchParams = $page.url.searchParams;
    const tokens: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    } | null = searchParams.has("data")
        ? JSON.parse(searchParams.get("data")!)
        : null;
    const error = searchParams.get("error");

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
            goto("/playlist");
        }

        mounted = true;
    });
</script>

<Title title="Playlist" />
<Login />