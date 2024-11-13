<script lang="ts">
	import { env } from '$env/dynamic/public'
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	function anotherOne() {
		const params = new URLSearchParams(window.location.search)
		params.set('ik-lust-er-nog-wel-eentje', 'true')

		const bakken = parseInt(params.get('bakken') || '0', 10) + 1
		params.set('bakken', bakken.toString())

		window.location.href = `${window.location.origin}${window.location.pathname}?${params.toString()}`
	}
</script>

<Title title="Jij wil graag een strafbak?" />

<p>{data.text}</p>

<br />

<div class="center">
	<button on:click={anotherOne}>Wil je er nog 1?</button>
</div>
