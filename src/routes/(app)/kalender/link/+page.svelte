<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { toast } from '$lib/notification'
	import type { PageData } from './$types'

	export let data: PageData

	function copy() {
		navigator.clipboard.writeText(data.link)
		toast({
			title: 'Gekopieerd',
			message: 'Link staat in je klembord',
			type: 'success',
		})
	}
</script>

<Title title="Link calender" />

<p>
	Op deze pagina kan je je agenda linken aan IBS. Dit doe je door de volgende link toe te voegen als agenda. Dit is een .ics die zich
	automatisch update, dus het zou eruit moeten zien als agenda.
</p>

<br />

<div class="link"><button class="btn-a" on:click={copy}>{data.link}</button></div>

<small>Klik op de link om hem te kopieren </small>

<style>
	@media screen and (max-width: 600px) {
		.link {
			text-align: center;
			display: flex;
			justify-content: center;
		}
	}
</style>
