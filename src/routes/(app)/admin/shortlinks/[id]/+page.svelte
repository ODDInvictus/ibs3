<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Shortlink {data.link.shortLink}" underTitle="Wie heeft wanneer op deze link geklikt" />

<h2>Informatie</h2>

<table class="striped small">
	<tbody>
		<tr>
			<td>Shortlink</td>
			<td>{data.link.shortLink}</td>
		</tr>
		<tr>
			<td>URL</td>
			<td>{data.link.link}</td>
		</tr>
		<tr>
			<td>Aangemaakt door</td>
			<td>{data.link.user.firstName}</td>
		</tr>
		<tr>
			<td>Aantal clicks</td>
			<td>{data.clicks.length}</td>
		</tr>
	</tbody>
</table>

<hr />
<h2>Clicks</h2>
<hr />

<table class="striped small">
	<thead>
		<tr>
			<th>ID</th>
			<th>Wanneer</th>
			<th>Gebruiker</th>
		</tr>
	</thead>
	<tbody>
		{#each data.clicks as click}
			<tr>
				<td>{click.id}</td>
				<td>{click.createdAt.toLocaleString('nl')}</td>
				<td>{click.user?.firstName}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	h2 {
		margin-top: 1rem;
	}
</style>
