<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Slideshow" />

<a href="https://github.com/ODDInvictus/ibs3/issues/216">
	<em>"Issue bestaat al"</em> - Niels
</a>
