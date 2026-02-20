<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Foto tags" />

{#each data.photoTags as pt}
	<a href="/fotos/album/tag/{pt.id}">{pt.name} ({pt._count.photos})</a>
	<br />
{/each}
