<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Foto tags" />

{#each data.photoTags as pt}
	<a href="/fotos/album/tag/{pt.id}">{pt.name} ({pt._count.photos})</a>
	<br />
{/each}
