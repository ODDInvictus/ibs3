<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { formatDateMonthYear } from '$lib/dateUtils'
	import { activitySlug } from '$lib/textUtils'
	import { markdown, stripMarkdown } from '$lib/utils'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Foto's van activiteiten" underTitle="Selecteer het fotoalbum dat je wil bekijken" />

{#each data.activities as ac}
	{#if ac._count.photos > 0}
		<a href="/fotos/album/{activitySlug(stripMarkdown(ac.name))}/{ac.id}">
			{@html markdown(ac.name)} ({ac._count.photos}) ({formatDateMonthYear(ac.startTime)})
		</a>
		<br />
	{/if}
{/each}

<br />

<p class="small">Activiteiten die hier niet staan hebben geen foto's :(</p>
<a class="small" href="/fotos/upload">Als er wel foto's zijn, upload ze!</a>

<style>
	.small {
		font-size: small;
	}
</style>
