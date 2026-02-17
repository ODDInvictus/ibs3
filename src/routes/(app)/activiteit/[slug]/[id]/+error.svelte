<script lang="ts">
	import { page } from '$app/state'
	import Title from '$lib/components/title.svelte'
</script>

<Title title="Oei! Activiteit {page.params.id} niet gevonden." shortTitle="Pagina niet gevonden" />

<p>Misschien is dit verwijderd of ben je zelf gewoon dom.</p>

<style>
	p {
		text-align: center;
	}
</style>
