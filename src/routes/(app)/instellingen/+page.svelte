<script lang="ts">
	import Title from '$lib/components/title.svelte';
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

<Title title="Instellingen" />
