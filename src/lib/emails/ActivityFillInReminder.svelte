<script lang="ts">
	import Base from './Base.svelte'
	import { env } from '$env/dynamic/private'
	import type { Activity } from '$lib/server/prisma/client'

	export let activities: Activity[]
</script>

<Base {...$$props}>
	<p>
		Voor de volgende
		{#if activities.length === 1}
			activiteit
		{:else}
			activiteiten
		{/if}
		heb je nog niet ingevuld of je aanwezig bent. Kan je dat nog even doen?
	</p>

	{#each activities as activity}
		<p>{activity.name}: <a href={env.ORIGIN + '/activiteit/' + activity.id} style="color:#551b8a;">Link</a></p>
	{/each}
</Base>
