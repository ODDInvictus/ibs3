<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Albums" />

<a href="/fotos/activiteit">Per activiteit</a>
<br />
<a href="/fotos/tags">Per tag</a>
<br />
<a href="/fotos/album/alles">Alle foto's</a>
