<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Albums" />

<a href="/fotos/activiteit">Per activiteit</a>
<br />
<a href="/fotos/tags">Per tag</a>
<br />
<a href="/fotos/album/alles">Alle foto's</a>
