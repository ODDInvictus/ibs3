<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Bestands overzicht" underTitle="Alle bestanden momenteel bekend bij IBS in GridFS" />

<div class="topbar">
	<a href="/file">Upload bestand</a>
</div>

<table class="striped small">
	<thead>
		<tr>
			<th>Naam</th>
			<th>_id</th>
			<th>Geupload op</th>
			<th>Uploader</th>
			<th>Acties</th>
		</tr>
	</thead>
	<tbody>
		{#each data.files as file}
			<tr>
				<td>{file.filename}</td>
				<td>{file.id}</td>
				<td>{file.createdAt.toLocaleDateString('nl')}</td>
				<td>{file.uploader?.firstName ?? ''}</td>
				<td><a href="/file/{file.filename}">Bekijk</a></td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.topbar {
		display: flex;
		justify-content: center;
	}
</style>
