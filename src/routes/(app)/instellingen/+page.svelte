<script lang="ts">
	import { toast } from '$lib/notification';
	import { onMount } from 'svelte';

	onMount(() => {
		toast({
			title: 'Instellingen',
			message: 'Soon™',
			type: 'warning'
		});
	});
</script>

<h1>Instellingen</h1>

<hr />

<style>
	h1 {
		text-align: center;
	}

	hr {
		margin: 0.5rem 0;
	}
</style>
